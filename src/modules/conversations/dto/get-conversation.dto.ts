import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ConversationType } from 'src/common/const';

export class GetConversationDto {
  @Transform(({ value }) => +value)
  @IsEnum(ConversationType)
  @IsNotEmpty()
  type: ConversationType;

  @IsNotEmpty()
  @IsString()
  userId: string; // ID của đối phương
}
