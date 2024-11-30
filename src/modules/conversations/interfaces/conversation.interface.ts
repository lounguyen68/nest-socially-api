import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ConversationType } from 'src/common/const';
import { Member } from 'src/modules/members/interfaces/member.interface';
import { Message } from 'src/modules/messages/interfaces/message.interface';

@Schema({ timestamps: true })
export class Conversation extends mongoose.Document {
  @Prop({ required: true })
  type: ConversationType;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  lastMessage: Message;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }] })
  members: Member[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
