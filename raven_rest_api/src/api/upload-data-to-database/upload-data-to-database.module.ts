import { Module } from '@nestjs/common';
import { UploadDataToDatabaseService } from './upload-data-to-database.service';
import { UploadDataToDatabaseController } from './upload-data-to-database.controller';
import { QuestionModule } from '../question/question.module';
import { FiltersModule } from '../filters/filters.module';
import { SurveyDataModule } from '../survey-data/survey-data.module';
import { ThemeModule } from '../theme/theme.module';
import { AppCacheModule } from '../shared/app-cache/app-cache.module';

@Module({
  imports: [
    AppCacheModule,
    FiltersModule,
    SurveyDataModule,
    QuestionModule,
    ThemeModule,
  ],
  controllers: [UploadDataToDatabaseController],
  providers: [UploadDataToDatabaseService],
})
export class UploadDataToDatabaseModule {}
