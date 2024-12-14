import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { MessageType } from 'src/common/const';
import { File } from 'src/modules/files/interfaces/file.interface';

export class CreateMessageDto {
  @IsEnum(MessageType, { message: 'Type must be a valid MessageType' })
  type: MessageType;

  @IsString({ message: 'Content must be a string' })
  @IsOptional()
  content?: string;

  @IsString({ message: 'SenderId must be a string' })
  sender: string;

  @IsString({ message: 'ConversationId must be a string' })
  conversation: string;

  @IsArray()
  @IsOptional()
  attachments?: File[];

  @IsBoolean()
  @IsOptional()
  isEncrypted?: boolean;
}
