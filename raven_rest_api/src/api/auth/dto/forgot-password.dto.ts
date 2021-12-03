import { ApiProperty } from '@nestjs/swagger';
import { SetPasswordDto } from './set-password.dto';

export class ForgotPasswordDto {
  @ApiProperty()
  email: string;
}
