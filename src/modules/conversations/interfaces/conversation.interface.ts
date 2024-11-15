import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ConversationType } from 'src/common/const';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  type: ConversationType;

  @Prop()
  name: string;

  @Prop()
  lastMessageId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
