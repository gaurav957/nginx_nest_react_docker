import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseScheme } from 'mongoose';

export type FiltersDocument = Document & Filters;

@Schema()
export class Filters {
  @Prop()
  qId: string;

  @Prop()
  order: number;

  @Prop()
  labelText: string;

  @Prop()
  selecttionType: string;

  @Prop({ default: true })
  active?: boolean;
}

export const FiltersSchema = SchemaFactory.createForClass(Filters);
