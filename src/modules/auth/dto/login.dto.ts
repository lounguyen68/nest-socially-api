import { IsString, IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  deviceToken: string;
}
