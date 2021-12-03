import { Module } from '@nestjs/common';
import { SurveyDataService } from './survey-data.service';
import { SurveyDataController } from './survey-data.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { SurveyData, SurveyDataSchema } from './survey-data.schema';
import { QuestionUtilModule } from '../shared/question-util/question-util.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SurveyData.name, schema: SurveyDataSchema },
    ]),
    QuestionUtilModule,
  ],
  controllers: [SurveyDataController],
  providers: [SurveyDataService],
  exports: [SurveyDataService],
})
export class SurveyDataModule {}
