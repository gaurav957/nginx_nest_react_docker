import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Req,
    HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe } from 'src/pipes/validation.pipe';
import { createUserValidation } from './validation/create-user.validation';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ApiResponse from '../shared/dto/api-response.dto';
import { IsEmailUniqueDto } from './dto/is-email-unique.dto';
import { responseMessages } from 'src/constant/message.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TOKEN_NAME } from 'src/constant/variable.constant';
import { updateUserValidation } from './validation/update-user.validation';
import { isEmailUniqueValidation } from './validation/is-email-unique.validation';
import { PaginateQueryDto } from '../shared/dto/paginate-query.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import Role from 'src/enums/role.enum';
import { showContentPageValidation } from './validation/show-content-page.validation';
import { ShowContentPageDto } from './dto/show-content-page.dto';

@Controller('/v1/user')
@ApiTags('User')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth(TOKEN_NAME)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async create(
        @Body(new JoiValidationPipe(createUserValidation))
        createUserDto: CreateUserDto,
        @Req() req,
    ) {
        await this.userService.create(createUserDto, req?.user?._id);
        return new ApiResponse(true, null, responseMessages.USER_CREATED);
    }


    @Get()
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async findAll(@Query() paginateParamDto: PaginateQueryDto) {
        const users = await this.userService.findAll(paginateParamDto);
        return new ApiResponse(true, users, responseMessages.USERS_FETCHED);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async findOne(@Param('id') id: string) {
        const response = await this.userService.findOne(id);
        return new ApiResponse(true, response, responseMessages.USERS_FETCHED);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async update(
        @Param('id') id: string,
        @Body(new JoiValidationPipe(updateUserValidation))
        updateUserDto: UpdateUserDto,
        @Req() req
    ) {
        await this.userService.update(id, updateUserDto, req.headers.authorization);
        return new ApiResponse(true, null, responseMessages.USER_MODIFIED);
    }

    @Patch('/activate/:id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async activateUser(@Param('id') id: string) {
        await this.userService.activateUser(id);
        return new ApiResponse(true, null, responseMessages.USER_ACTIVATED);
    }

    @Patch('/de-activate/:id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async deActivateUser(@Param('id') id: string) {
        await this.userService.deActivateUser(id);
        return new ApiResponse(true, null, responseMessages.USER_DEACTIVATED);
    }

    @Patch('/grant-admin/:id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async grantAdmin(@Param('id') id: string) {
        await this.userService.grantAdmin(id);
        return new ApiResponse(true, null, responseMessages.USER_UPGRADE);
    }

    @Patch('/revoke-admin/:id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async revokeAdmin(@Param('id') id: string) {
        await this.userService.revokeAdmin(id);
        return new ApiResponse(true, null, responseMessages.USER_DOWNGRADE);
    }

    @Post('/is-email-unique')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async isEmailUnique(
        @Body(new JoiValidationPipe(isEmailUniqueValidation))
        isEmailUniqueDto: IsEmailUniqueDto,
    ) {
        const response = await this.userService.isUserEmailUnique(
            isEmailUniqueDto.email,
        );

        return new ApiResponse(
            response,
            null,
            response
                ? responseMessages.EMAIL_UNIQUE
                : responseMessages.EMAIL_NOT_UNIQUE,
        );
    }

    @Post('/resend-activation-email/:id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    @HttpCode(200)
    async resendActivationEmail(@Param('id') id: string) {
        await this.userService.resendActivationEmail(id);
        return new ApiResponse(true, null, responseMessages.SEND_EMAIL);
    }

    @Patch('/show-content-page/:id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    async showContentPage(
        @Param('id') id: string,
        @Body(new JoiValidationPipe(showContentPageValidation))
        showContentPageDto: ShowContentPageDto,
    ) {
        await this.userService.showContentPage(id, showContentPageDto);
        return new ApiResponse(true, null, responseMessages.SUCCESS);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.KEY_ADMIN)
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
