import { Injectable } from '@nestjs/common';
import { FiltersService } from '../filters/filters.service';
import { QuestionService } from '../question/question.service';
import { SurveyDataService } from '../survey-data/survey-data.service';
import { ThemeService } from '../theme/theme.service';

@Injectable()
export class UploadDataToDatabaseService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly filtersService: FiltersService,
    private readonly surveyDataService: SurveyDataService,
    private readonly themeService: ThemeService,
  ) {}
  async uploadData() {
    await this.themeService.setDefaultTheme();
    await this.questionService.bulkInsertMasterQuestions();
    await this.questionService.bulkInsertQuestions();
    await this.questionService.bulkInsertBannerQuestions();
    await this.filtersService.create();
    await this.surveyDataService.create();
  }
}
