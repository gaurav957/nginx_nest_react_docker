import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseScheme } from 'mongoose';

export type SurveyDataDocument = Document & SurveyData;

@Schema({ strict: false })
export class SurveyData {
  @Prop()
  respId: string;
}

export const SurveyDataSchema = SchemaFactory.createForClass(SurveyData);
