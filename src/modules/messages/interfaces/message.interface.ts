import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { MessageType } from 'src/common/const';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  type: MessageType;

  @Prop()
  content?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true })
  sender: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  })
  conversation: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
