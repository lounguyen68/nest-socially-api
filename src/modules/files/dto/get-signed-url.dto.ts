import { IsString } from 'class-validator';

export class GetSignedUrlDto {
  @IsString()
  key: string;
  @IsString()
  contentType: string;
  @IsString()
  uploadType: string;
}
