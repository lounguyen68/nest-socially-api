import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MessageType } from 'src/common/const';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  type: MessageType;

  @Prop()
  content: string;

  @Prop()
  senderId: string;

  @Prop()
  conversationId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
