import { Injectable } from '@nestjs/common';
import { QuestionType } from 'src/enums/question-type.enum';
import { GridQuestionUtil } from './grid-question.util';
import { MultiGridQuestionUtil } from './multi-grid-question.util';
import { MultiQuestionUtil } from './multi-question.util';
import { IQuestionUtil } from './question-util.interface';
import { RankQuestionUtil } from './rank-question.util';
import { SingleQuestionUtil } from './single-question.util';
import { UnknownQuestionUtil } from './unknown-question.util';

@Injectable()
export class QuestionUtilGenerator {
  constructor(
    private readonly singleQestionUtil: SingleQuestionUtil,
    private readonly multiQestionUtil: MultiQuestionUtil,
    private readonly gridQestionUtil: GridQuestionUtil,
    private readonly rankQestionUtil: RankQuestionUtil,
    private readonly multiGridQestionUtil: MultiGridQuestionUtil,
    private readonly unknownQestionUtil: UnknownQuestionUtil,
  ) {}

  init(questionType: QuestionType): IQuestionUtil {
    switch (questionType) {
      case QuestionType.Single:
        return this.singleQestionUtil;
      case QuestionType.Multi:
        return this.multiQestionUtil;
      case QuestionType.SingleGrid:
        return this.gridQestionUtil;
      case QuestionType.Rank:
        return this.rankQestionUtil;
      case QuestionType.MultiGrid:
        return this.multiGridQestionUtil;
      default:
        return this.unknownQestionUtil;
    }
  }
}
