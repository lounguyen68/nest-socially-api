import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MessageType } from 'src/common/const';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  type: MessageType;

  @Prop()
  content?: string;

  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
