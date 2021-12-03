import { ApiProperty } from '@nestjs/swagger';

export class LogErrorDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  origin?: number;

  @ApiProperty()
  req?: object;
}
