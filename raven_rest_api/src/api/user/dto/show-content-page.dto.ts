import { ApiProperty } from '@nestjs/swagger';

export class ShowContentPageDto {
  @ApiProperty({ default: true })
  showContentPageCheck: boolean;
}
