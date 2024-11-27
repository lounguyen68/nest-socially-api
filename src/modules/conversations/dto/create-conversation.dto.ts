import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ConversationType } from 'src/common/const';

export class CreateConversationDto {
  @Transform(({ value }) => +value)
  @IsEnum(ConversationType)
  @IsNotEmpty()
  type: ConversationType;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  creatorId?: string;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
