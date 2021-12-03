import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import ApiResponse from '../shared/dto/api-response.dto';
import { responseMessages } from 'src/constant/message.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SetPasswordDto } from './dto/set-password.dto';
import { JoiValidationPipe } from 'src/pipes/validation.pipe';
import { loginValidation } from './validation/login.validation';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { resetPasswordValidation } from './validation/reset-password.validation';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { forgotPasswordValidation } from './validation/forgot-password.validation';
import { changePasswordValidation } from './validation/change-password.validation';
import { ChangePasswordDto } from './dto/change-password.dto';

import { TOKEN_NAME } from 'src/constant/variable.constant';
import { Roles } from './roles.decorator';
import Role from 'src/enums/role.enum';
@Controller('/v1/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body(new JoiValidationPipe(loginValidation)) loginDto: LoginDto,
  ) {
    const response = await this.authService.login(loginDto);
    return new ApiResponse(true, response, responseMessages.USER_AUTHENTICATED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth(TOKEN_NAME)
  @Roles(Role.ADMIN, Role.KEY_ADMIN, Role.USER)
  @Post('/logout')
  @HttpCode(200)
  async logout(@Req() req) {    
    const response = await this.authService.logout(
      req.user.email,
      req.headers.authorization,
    );
    return new ApiResponse(true, response, responseMessages.USER_LOGOUT);
  }

  @Post('/set-password')
  @HttpCode(200)
  async setPassword(
    @Body(new JoiValidationPipe(resetPasswordValidation))
    setPasswordDto: SetPasswordDto,
  ) {
    await this.authService.setPassword(setPasswordDto);
    return new ApiResponse(true, null, responseMessages.USER_PASSWORD_UPDATED);
  }

  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body(new JoiValidationPipe(resetPasswordValidation))
    resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(resetPasswordDto);
    return new ApiResponse(true, null, responseMessages.USER_PASSWORD_UPDATED);
  }

  @Post('/forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body(new JoiValidationPipe(forgotPasswordValidation))
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return new ApiResponse(true, null, responseMessages.SEND_EMAIL);
  }

  @Patch('/change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(changePasswordValidation))
    changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(id, changePasswordDto);
    return new ApiResponse(true, null, responseMessages.PASSWORD_CHANGE);
  }
}
