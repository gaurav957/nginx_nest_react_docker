import { Injectable } from '@nestjs/common';
import { MasterQuestion } from 'src/api/question/schema/master-question.schema';
import { IMasterQuestionTemplate } from 'src/types/template-data.interface';
import { IQuestionUtil } from './question-util.interface';

@Injectable()
export class UnknownQuestionUtil implements IQuestionUtil {
  generateQuestionDocument(question: IMasterQuestionTemplate, labels: any[]) {
    return null;
  }

  generateAggregation(qId: string) {
    return [];
  }
  generateSurveyResponseObject(question: MasterQuestion, surveyRow: object) {
    return null;
  }
}
