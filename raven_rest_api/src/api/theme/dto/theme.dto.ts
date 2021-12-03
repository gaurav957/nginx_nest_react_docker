import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class ThemeDto {
  @ApiProperty()
  chartFontFace: string;
  @ApiProperty()
  chartColors: Array<string>;
  @ApiProperty()
  chartAxisColor: string;
  @ApiProperty()
  dataLabelColor: string;
  @ApiProperty()
  logoBase64String: string;
  @ApiProperty()
  catAxisFontSize: number;
  @ApiProperty()
  valAxisFontSize: number;
  @ApiProperty()
  lengendFontSize: number;
  @ApiProperty()
  dataLabelFontSize: number;
  @ApiProperty()
  userManagement: boolean;
  @ApiProperty()
  pptExport: boolean;
  @ApiProperty()
  pdfExport: boolean;
  @ApiProperty()
  ChartTable: boolean;
  @ApiProperty()
  CrossTabulation: boolean;
  @ApiProperty()
  TourGuid: boolean;
  @ApiProperty()
  Filters: boolean;
  @ApiProperty()
  primaryFontFace: string;
  @ApiProperty()
  primaryColor: string;
  @ApiProperty()
  secondaryColor: string;
  @ApiProperty()
  clientName: string;
  @ApiProperty()
  sourceText: string;
  @ApiProperty()
  copyRightText: string;
}
