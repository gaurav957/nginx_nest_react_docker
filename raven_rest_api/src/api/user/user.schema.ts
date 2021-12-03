import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseScheme } from 'mongoose';

export type UserDocument = Document & User;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop()
  name: string;

  @Prop({ ref: 'users' })
  createdBy: MongooseScheme.Types.ObjectId;

  @Prop({ default: true })
  isEmailSent: boolean;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isKeyAdmin: boolean;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: true })
  pending: boolean;

  @Prop({ default: true })
  showContentPage: boolean;
}

export const UserSchmea = SchemaFactory.createForClass(User);
