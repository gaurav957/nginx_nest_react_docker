import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerQuestionDocument = Document & BannerQuestion;

@Schema()
export class BannerQuestion {
  @Prop()
  qId: string;

  @Prop()
  labelText: string;

  @Prop()
  order: number;

  @Prop()
  active: boolean;
}

export const BannerQuestionSchema =
  SchemaFactory.createForClass(BannerQuestion);
