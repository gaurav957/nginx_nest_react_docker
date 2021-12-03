import { ApiProperty } from '@nestjs/swagger';

export class LogWarnDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  origin?: number;

  @ApiProperty()
  req?: object;
}
