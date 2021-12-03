import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseScheme } from 'mongoose';

export type ThemeDocument = Document & Theme;
@Schema()
export class Theme {
  @Prop()
  key: string;
  @Prop()
  chartFontFace: string;
  @Prop()
  chartColors: Array<string>;
  @Prop()
  chartAxisColor: string;
  @Prop()
  dataLabelColor: string;
  @Prop()
  logoBase64String: string;
  @Prop()
  catAxisFontSize: number;
  @Prop()
  valAxisFontSize: number;
  @Prop()
  lengendFontSize: number;
  @Prop()
  dataLabelFontSize: number;
  @Prop()
  userManagement: boolean;
  @Prop()
  pptExport: boolean;
  @Prop()
  pdfExport: boolean;
  @Prop()
  ChartTable: boolean;
  @Prop()
  CrossTabulation: boolean;
  @Prop()
  TourGuid: boolean;
  @Prop()
  Filters: boolean;
  @Prop()
  primaryFontFace: string;
  @Prop()
  primaryColor: string;
  @Prop()
  secondaryColor: string;
  @Prop()
  clientName: string;
  @Prop()
  sourceText: string;
  @Prop()
  copyRightText: string;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);
