import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
  @IsString()
  @IsOptional()
  deviceToken?: string;
}
