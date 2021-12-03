import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MasterQuestion,
  MasterQuestionSchema,
} from './schema/master-question.schema';
import { QuestionUtilModule } from '../shared/question-util/question-util.module';
import { Question, QuestionSchema } from './schema/question.schema';
import {
  BannerQuestion,
  BannerQuestionSchema,
} from './schema/banner-question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MasterQuestion.name, schema: MasterQuestionSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: BannerQuestion.name, schema: BannerQuestionSchema },
    ]),
    QuestionUtilModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
