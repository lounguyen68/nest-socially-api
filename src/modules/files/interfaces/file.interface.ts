import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Metadata } from 'src/common/const/file.const';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  path: string;

  @Prop({ required: true })
  metadata: Metadata;

  @Prop()
  conversationId: string;

  @Prop()
  messageId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
