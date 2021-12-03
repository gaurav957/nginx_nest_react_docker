import { PartialType } from '@nestjs/swagger';
import { CreateSurveyDatumDto } from './create-survey-datum.dto';

export class UpdateSurveyDatumDto extends PartialType(CreateSurveyDatumDto) {}
