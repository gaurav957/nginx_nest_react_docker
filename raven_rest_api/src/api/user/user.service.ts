import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import {
  mailMessages,
  responseErrors,
  responseMessages,
} from 'src/constant/message.constant';
import { PaginateQueryDto } from '../shared/dto/paginate-query.dto';
import { BaseDaoService } from '../shared/base-dao/base-dao.service';
import { MailService } from '../shared/mail/mail.service';
import envConfig from 'src/config/env.config';
import { Cache } from 'cache-manager';
import { omit } from 'lodash';
import { CryptoService } from '../shared/crypto/crypto/crypto.service';
import { PaginateService } from '../shared/base-dao/paginate.service';
import { ShowContentPageDto } from './dto/show-content-page.dto';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly paginateService: PaginateService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly cryptoService: CryptoService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto, parentUserId: string) {
    const isEmailUnique = await this.isUserEmailUnique(createUserDto.email);
    if (!isEmailUnique) {
      throw new BadRequestException(responseMessages.EMAIL_EXISTS);
    }

    const firstNameArr = createUserDto.firstName.trim().split('');
    firstNameArr[0] = firstNameArr[0].toUpperCase();
    const firstName = firstNameArr.join('');

    const lastNameArr = createUserDto?.lastName?.trim().split('') || [];
    let lastName = '';
    if (lastNameArr.length) {
      lastNameArr[0] = lastNameArr[0].toUpperCase();
      lastName = lastNameArr.join('');
    }

    let name = firstName + ' ' + lastName;
    name = name.trim();

    const user = await this.userModel.create({
      firstName,
      lastName,
      ...omit(createUserDto, ['firstName', 'lastName']),
      name,
      createdBy: parentUserId,
    });

    if (!user) {
      throw new InternalServerErrorException(responseErrors.SERVER_ERROR);
    }
    const activationToken = this.cryptoService.generateRandomToken();

    const setPassLink = `${envConfig.uiUrl.uiBaseUrl}set-password?email=${user.email}&&token=${activationToken}`;

    const mailResponse = await this.mailService.mailGenerator(
      user.email,
      'Welcome ' + user.firstName + ' to HFS, Please set your password',
      './account-activation',
      { name: user.firstName, setPassLink },
      'set',
      604800,
      activationToken,
    );

    if (!mailResponse) {
      await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          isEmailSent: false,
        },
      );
      throw new BadRequestException(responseErrors.EMAIL_CONFIRMATION_NOT_SENT);
    }
  }

  async findAll(paginateQueryDto: PaginateQueryDto) {
    const query = this.paginateService.initPaginate(
      paginateQueryDto,
      this.userModel,
    );
    // .search(['name', 'email']);
    query.search(['name', 'email']);
    const lookUpQuery = [
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $set: {
          createdBy: { $arrayElemAt: ['$createdBy.name', 0] },
        },
      },
    ];
    if (paginateQueryDto.sortBy === 'createdBy') {
      return query
        .aggregate(...lookUpQuery)
        .sort()
        .paginate()
        .exec();
    } else {
      return query
        .sort()
        .paginate()
        .aggregate(...lookUpQuery)
        .exec();
    }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }

    return { ...omit(user, ['password', '__v']) };
  }

  async isUserEmailUnique(email: string, id?: string): Promise<boolean> {
    try {
      const query = {
        email,
      };
      if (id) {
        query['_id'] = id;
      }
      const user = await this.userModel.find(query).lean();

      if (user && user.length) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, rawHashedToken) {
    const user = await this.userModel.findById({ _id: id });
    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    const firstNameArr =
      updateUserDto?.firstName?.trim().split('') ||
      user.firstName.trim().split('');
    firstNameArr[0] = firstNameArr[0].toUpperCase();
    const firstName = firstNameArr.join('');

    const lastNameArr =
      updateUserDto?.lastName?.trim().split('') ||
      user.lastName.trim().split('');
    let lastName = '';
    if (lastNameArr.length) {
      lastNameArr[0] = lastNameArr[0].toUpperCase();
      lastName = lastNameArr.join('');
    }

    let name = firstName + ' ' + lastName;
    name = name.trim();

    if (!updateUserDto.email || updateUserDto.email === user.email) {
      //delete old user email token and logout user
      await this.authService.logout(user.email, rawHashedToken);
      await this.userModel.findOneAndUpdate(
        { _id: id },
        {
          firstName,
          lastName,
          ...omit(updateUserDto, ['firstName', 'lastName']),
          name,
        },
      );
    } else {
      if (!user.pending) {
        throw new BadRequestException(responseMessages.EMAIL_CANT_UPDATE);
      }

      const isEmailUnique = await this.isUserEmailUnique(updateUserDto.email);

      if (!isEmailUnique) {
        throw new BadRequestException(responseMessages.EMAIL_EXISTS);
      }
      //delete old user email token and logout user
      await this.authService.logout(user.email, rawHashedToken);
      const updatedUserRecord = await this.userModel.findOneAndUpdate(
        { _id: id },
        {
          firstName,
          lastName,
          ...omit(updateUserDto, ['firstName', 'lastName']),
          name,
          isEmailSent: true,
        },
        { new: true },
      );

      const activationToken = await this.cryptoService.generateRandomToken();
      const setPassLink = `${envConfig.uiUrl.uiBaseUrl}set-password?email=${updatedUserRecord.email}&&token=${activationToken}`;

      const mailResponse = await this.mailService.mailGenerator(
        updatedUserRecord.email,
        'Welcome ' +
          updatedUserRecord.firstName +
          ' to HFS, Please set your password',
        './account-activation',
        {
          name,
          setPassLink,
        },
        'set',
        604800,
        activationToken,
      );

      if (!mailResponse) {
        await this.userModel.findOneAndUpdate(
          { _id: updatedUserRecord._id },
          {
            isEmailSent: false,
          },
        );

        throw new BadRequestException(
          responseErrors.USER_EDITED_BUT_MAIL_NOT_SEND,
        );
      }
    }
  }

  async activateUser(id: string) {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }

    if (user.active) {
      throw new BadRequestException(responseMessages.ALREADY_ACTIVATED);
    }

    if (!user.isKeyAdmin) {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        { active: true },
        { new: true },
      );

      if (updatedUser.active) {
        const mailResponse = await this.mailService.sendMail(
          './account-reactivation',
          user.email,
          mailMessages.ACCOUNT_REACTIVATED_MAIL_SUBJECT,
          {
            name: updatedUser.firstName,
            loginLink: `${envConfig.uiUrl.uiBaseUrl}login`,
          },
        );

        if (!mailResponse) {
          throw new BadRequestException(responseErrors.MAIL_NOT_SEND);
        }
      }
    } else {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }
  }

  async deActivateUser(id: string) {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (!user.active) {
      throw new BadRequestException(responseMessages.ALREADY_DEACTIVATED);
    }
    if (user.pending) {
      throw new BadRequestException(
        responseErrors.CAN_NOT_DEACTIVATE_IF_PENDING,
      );
    }
    if (!user.isKeyAdmin) {
      //delete all access token keys if account is deactivated
      await this.cacheManager.store.del('accessToken' + '_' + user.email);
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        { active: false },
        { new: true },
      );

      if (!updatedUser.active) {
        const mailResponse = await this.mailService.sendMail(
          './account-deactivation',
          user.email,
          mailMessages.ACCOUNT_DEACTIVATED_MAIL_SUBJECT,
          {
            name: updatedUser.firstName,
          },
        );

        if (!mailResponse) {
          throw new BadRequestException(responseErrors.MAIL_NOT_SEND);
        }
      }
    } else {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }
  }

  async grantAdmin(id: string) {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (user.isAdmin) {
      throw new BadRequestException(responseMessages.ALREADY_ADMIN);
    }
    if (!user.isKeyAdmin) {
      await this.cacheManager.store.del('accessToken' + '_' + user.email);
      await this.userModel.findOneAndUpdate({ _id: id }, { isAdmin: true });
    } else {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }
  }

  async revokeAdmin(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (!user.isAdmin) {
      throw new BadRequestException(responseMessages.ALREADY_NOT_ADMIN);
    }

    if (!user.isKeyAdmin) {
      await this.cacheManager.store.del('accessToken' + '_' + user.email);
      await this.userModel.findOneAndUpdate({ _id: id }, { isAdmin: false });
    } else {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }
  }

  async resendActivationEmail(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }

    if (!user.pending) {
      throw new BadRequestException(responseErrors.EMAIL_CONFIRMED);
    }
    const activationToken = this.cryptoService.generateRandomToken();
    const setPassLink = `${envConfig.uiUrl.uiBaseUrl}set-password?email=${user.email}&&token=${activationToken}`;
    const mailResponse = await this.mailService.mailGenerator(
      user.email,
      'Welcome ' + user.firstName + ' to HFS, Please set your password',
      './account-activation',
      {
        name: user.firstName,
        setPassLink,
      },
      'set',
      604800,
      activationToken,
    );
    if (!mailResponse) {
      throw new BadRequestException(responseErrors.MAIL_SERVER_ERROR);
    }
  }

  async showContentPage(id: string, showContentPageDto: ShowContentPageDto) {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    await this.userModel.findOneAndUpdate(
      { _id: id },
      { showContentPage: showContentPageDto.showContentPageCheck },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
