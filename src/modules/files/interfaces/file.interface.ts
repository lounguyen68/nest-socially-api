import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Metadata } from 'src/common/const/file.const';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop()
  name: string;

  @Prop()
  path: string;

  @Prop({ required: true })
  metadata: Metadata;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  message?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversation?: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
