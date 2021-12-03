import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Document & Question;

@Schema()
export class Question {
  @Prop()
  qId: string;

  @Prop()
  order: number;

  @Prop()
  chartType: string[];

  @Prop()
  labelText: string;

  @Prop()
  netAllowed: boolean;

  @Prop()
  split: boolean;

  @Prop()
  active: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
