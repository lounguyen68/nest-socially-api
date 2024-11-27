import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Metadata } from 'src/common/const/file.const';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop()
  name: string;

  @Prop()
  path: string;

  @Prop({ required: true })
  metadata: Metadata;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  messageId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation' })
  conversationId?: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
