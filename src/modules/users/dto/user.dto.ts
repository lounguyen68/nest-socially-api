import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserDto {
  @Transform(({ value }) => value.toString())
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  avatarPath: string;
}
