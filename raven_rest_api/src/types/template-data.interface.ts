import { QuestionType } from 'src/enums/question-type.enum';

export interface ILabelTemplate {
  qId: string;
  subQuesId: string;
  label: string;
  code: string;
  variableId: string;
  order: string;
}

export interface IMasterQuestionTemplate {
  qId: string;
  qText: string;
  // qLabelText: string;
  type: QuestionType;
  dataPosition: string;
  gridId: string;
  subType: string;
}

export interface IQuestionTemplate {
  qId: string;
  order: string;
  chartTypes: string;
  netAllowed: string;
  split: string;
  active: string;
  qLabelText: string;
}

export interface IBannerTemplate {
  qId: string;
  order: string;
  active: string;
  qLabelText: string;
}

export interface IFilterTemplate {
  qId: string;
  sType: 'S' | 'M';
  order: string;
  active: string;
  qLabelText: string;
}
