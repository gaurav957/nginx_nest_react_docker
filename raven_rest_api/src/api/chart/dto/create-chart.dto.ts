import { ApiProperty } from '@nestjs/swagger';
import { Filter } from 'src/api/shared/dto/question-filter.dto';
import { QuestionType } from 'src/enums/question-type.enum';

export class CreateChartDto {
  @ApiProperty()
  qId: string;

  @ApiProperty()
  type: QuestionType;

  @ApiProperty({ type: () => [Filter] })
  filters: Filter[];

  @ApiProperty({ required: false })
  bannerQuestion: string;
}
