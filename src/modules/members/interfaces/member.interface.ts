import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Member extends Document {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  conversationId: string;

  @Prop({ default: Date.now() })
  lastTimeSeen: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
