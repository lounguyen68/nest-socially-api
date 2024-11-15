import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from 'src/common/const';

export class CreateMessageDto {
  @IsEnum(MessageType, { message: 'Type must be a valid MessageType' })
  type: MessageType;

  @IsString({ message: 'Content must be a string' })
  @IsOptional()
  content?: string;

  @IsString({ message: 'SenderId must be a string' })
  senderId: string;

  @IsString({ message: 'ConversationId must be a string' })
  conversationId: string;
}
