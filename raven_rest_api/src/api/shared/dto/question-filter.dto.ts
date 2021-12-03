import { ApiProperty } from '@nestjs/swagger';

export class Filter {
  @ApiProperty()
  qId: string;

  @ApiProperty()
  value: string[];
}
