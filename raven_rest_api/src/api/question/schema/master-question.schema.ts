import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseScheme } from 'mongoose';
import { QuestionType } from 'src/enums/question-type.enum';

export type MasterQuestionDocument = Document & MasterQuestion;

@Schema()
export class MasterQuestion {
  @Prop()
  qId: string;
  @Prop()
  labelText: string;
  @Prop()
  questionText: string;
  @Prop()
  type: QuestionType;
  @Prop()
  options?: {
    variableId?: string;
    labelText: string;
    labelCode: string;
  }[];
  @Prop()
  subGroups?: MasterQuestion[];
  @Prop()
  scale?: {
    labelText: string;
    labelCode: string;
  }[];
}

export const MasterQuestionSchema =
  SchemaFactory.createForClass(MasterQuestion);
