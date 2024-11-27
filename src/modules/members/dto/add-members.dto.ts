import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class AddMembersDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  userIds: string[];
}
