import { LeanDocument } from 'mongoose';
import { MasterQuestion } from 'src/api/question/schema/master-question.schema';
import { QuestionDocument } from 'src/api/question/schema/question.schema';
import { ISurveyResponse } from 'src/types/survey-response.interface';
import { IMasterQuestionTemplate } from 'src/types/template-data.interface';

export interface IQuestionUtil {
  generateAggregation: (
    qId: string,
    bannerQuestion?: string,
    question?: any,
  ) => object[];

  generateQuestionDocument: (
    question: IMasterQuestionTemplate,
    labels: any[],
  ) => object | null;

  generateSurveyResponseObject: (
    question: MasterQuestion,
    surveyRow: object,
  ) => ISurveyResponse | ISurveyResponse[];

  generateCountAggregation?: (question: QuestionDocument) => any[];
}
