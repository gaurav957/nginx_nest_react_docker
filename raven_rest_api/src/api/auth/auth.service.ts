import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import {
  mailMessages,
  responseErrors,
  responseMessages,
} from 'src/constant/message.constant';
import { SetPasswordDto } from './dto/set-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../shared/mail/mail.service';
import { omit } from 'lodash';
import { Cache } from 'cache-manager';
import envConfig from 'src/config/env.config';
import { CryptoService } from '../shared/crypto/crypto/crypto.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly cryptoService: CryptoService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto) {
    const userObj = await this.validateUserCredentials(loginDto);
    const previousAccessToken = await this.cacheManager.store.get(
      'accessToken_' + loginDto.email,
    );
    if (previousAccessToken) {
      const newAccessToken = [];
      newAccessToken.push(this.cryptoService.generateJWTAccessToken(userObj));
      const tokens = previousAccessToken.concat(newAccessToken);
      await this.cacheManager.store.set(
        'accessToken' + '_' + userObj.email,
        tokens,
      );

      return {
        ...omit(userObj, ['password', '__v']),
        accessToken: newAccessToken[0],
      };
    } else {
      const accessToken = this.cryptoService.generateJWTAccessToken(userObj);
      await this.cacheManager.store.set('accessToken' + '_' + userObj.email, [
        accessToken,
      ]);
      return { ...omit(userObj, ['password', '__v']), accessToken };
    }
  }

  async logout(email, rawHashedToken) {
    const accessToken = await this.cacheManager.store.get(
      'accessToken_' + email,
    );

    if (email == undefined || rawHashedToken == undefined) {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }
    if (accessToken == null) {
      throw new BadRequestException(responseErrors.SESSION_EXPIRED);
    }
    let hashedToken;
    if (rawHashedToken.match('bearer')) {
      hashedToken = rawHashedToken.replace('bearer ', '');
    } else if (rawHashedToken.match('Bearer')) {
      hashedToken = rawHashedToken.replace('Bearer ', '');
    } else {
      throw new BadRequestException(responseMessages.PERMISSION_DENIED);
    }

    if (accessToken) {
      const indexOfToken = accessToken.indexOf(hashedToken);

      if (indexOfToken > -1) {
        accessToken.splice(indexOfToken, 1);
        if (accessToken == '') {
          await this.cacheManager.store.del('accessToken' + '_' + email);
        } else {
          await this.cacheManager.store.set(
            'accessToken' + '_' + email,
            accessToken,
          );
        }
      } else {
        throw new BadRequestException(responseErrors.SESSION_EXPIRED);
      }
    }
  }

  async setPassword(setPasswordDto: SetPasswordDto) {
    const user = await this.findUserByEmail(setPasswordDto.email);

    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (!user.pending) {
      throw new BadRequestException(responseErrors.PASSWORD_ALREADY_SET);
    }
    const cacheKey = await this.cacheManager.store.get('set_' + user.email);
    if (cacheKey == setPasswordDto.token) {
      const encryptPass = await this.cryptoService.hashPassword(
        setPasswordDto.password,
      );
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { pending: false, password: encryptPass },
        { new: true },
      );
      await this.cacheManager.store.del('set_' + user.email);

      if (!updatedUser.pending) {
        const ActivationSuccMailResponse = await this.mailService.sendMail(
          './activation-successful',
          user.email,
          mailMessages.ACTIVATION_SUCCESS_MAIL_SUBJECT,
          {
            name: updatedUser.firstName,
            loginLink: `${envConfig.uiUrl.uiBaseUrl}login`,
          },
        );

        if (!ActivationSuccMailResponse) {
          throw new BadRequestException(
            responseErrors.ACTIVATION_SUCC_MAIL_NOT_SEND,
          );
        }
      }
    } else {
      throw new BadRequestException(responseErrors.INVALID_TOKEN);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.findUserByEmail(resetPasswordDto.email);

    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (user.pending) {
      throw new BadRequestException(responseErrors.FIRST_TIME_PASSWORD_NOTSET);
    }

    const CacheKey = await this.cacheManager.store.get('reset_' + user.email);

    if (CacheKey == resetPasswordDto.token) {
      const encryptPass = await this.cryptoService.hashPassword(
        resetPasswordDto.password,
      );
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { password: encryptPass },
        { new: true },
      );
      await this.cacheManager.store.del('reset_' + user.email);

      if (updatedUser) {
        const mailResponse = await this.mailService.sendMail(
          './reset-password-successful',
          user.email,
          mailMessages.PASSWORD_RESET_SUCC_MAIL_SUBJECT,
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
      throw new BadRequestException(responseErrors.INVALID_TOKEN);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.findUserByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (user.pending) {
      throw new BadRequestException(responseErrors.FIRST_TIME_PASSWORD_NOTSET);
    }
    const activationToken = await this.cryptoService.generateRandomToken();

    const resetPassLink = `${envConfig.uiUrl.uiBaseUrl}reset-password?email=${user.email}&&token=${activationToken}`;

    const mailResponse = await this.mailService.mailGenerator(
      user.email,
      'Forgot password',
      './forgot-password',
      {
        name: user.firstName,
        resetPassLink,
      },
      'reset',
      180,
      activationToken,
    );

    if (!mailResponse) {
      throw new BadRequestException(responseErrors.ERROR_OCCURED);
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException(responseMessages.NOT_FOUND);
    }
    if (user.pending) {
      throw new BadRequestException(responseErrors.FIRST_TIME_PASSWORD_NOTSET);
    }

    if (
      await this.cryptoService.comparePasswordHash(
        changePasswordDto.oldPassword,
        user.password,
      )
    ) {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          password: await this.cryptoService.hashPassword(
            changePasswordDto.newPassword,
          ),
        },

        { new: true },
      );
      if (
        await this.cryptoService.comparePasswordHash(
          changePasswordDto.newPassword,
          user.password,
        )
      ) {
        const mailResponse = await this.mailService.sendMail(
          './reset-password-successful',
          user.email,
          mailMessages.PASSWORD_RESET_SUCC_MAIL_SUBJECT,
          {
            name: updatedUser.firstName,
            loginLink: `${envConfig.uiUrl.uiBaseUrl}`,
          },
        );

        if (!mailResponse) {
          throw new BadRequestException(responseErrors.MAIL_NOT_SEND);
        }
      }
    } else {
      throw new BadRequestException(responseErrors.INVALID_CREDENTIALS);
    }
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  async validateUserCredentials(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException(responseErrors.INVALID_CREDENTIALS);
    }
    if (!user.active) {
      throw new BadRequestException(responseErrors.ACCOUNT_DISABLED);
    }
    if (user.pending) {
      throw new BadRequestException(responseErrors.USER_NOT_ACTIVATED);
    }

    const compareResult = await this.cryptoService.comparePasswordHash(
      password,
      user.password,
    );

    if (!compareResult) {
      throw new BadRequestException(responseErrors.INVALID_CREDENTIALS);
    }

    return user;
  }
}
