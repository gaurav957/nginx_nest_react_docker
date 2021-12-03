import { ApiProperty } from '@nestjs/swagger';

export class IsEmailUniqueDto {
  @ApiProperty()
  email: string;
}
