import { IsString } from 'class-validator';

export class UpdateAvatarUserDto {
  @IsString()
  avatarPath: string;
}
