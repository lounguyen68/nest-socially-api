import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationType } from 'src/common/const';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true })
  type: ConversationType;

  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessageId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  members: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
