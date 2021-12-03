import { Module } from '@nestjs/common';
import { GridQuestionUtil } from './grid-question.util';
import { MultiGridQuestionUtil } from './multi-grid-question.util';
import { MultiQuestionUtil } from './multi-question.util';
import { QuestionUtilGenerator } from './question.util';
import { RankQuestionUtil } from './rank-question.util';
import { SingleQuestionUtil } from './single-question.util';
import { UnknownQuestionUtil } from './unknown-question.util';

@Module({
  providers: [
    SingleQuestionUtil,
    MultiQuestionUtil,
    UnknownQuestionUtil,
    GridQuestionUtil,
    RankQuestionUtil,
    MultiGridQuestionUtil,
    QuestionUtilGenerator,
  ],
  exports: [QuestionUtilGenerator],
})
export class QuestionUtilModule {}
