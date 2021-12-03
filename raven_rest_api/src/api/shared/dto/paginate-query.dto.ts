import { ApiProperty } from '@nestjs/swagger';

export class PaginateQueryDto {
  @ApiProperty({ required: false })
  currentPage?: number;

  @ApiProperty({ required: false })
  recordsPerPage?: number;

  @ApiProperty({ required: false })
  searchText?: string;

  @ApiProperty({ required: false })
  sortBy?: string;

  @ApiProperty({ required: false })
  sortOrder?: string;
}
