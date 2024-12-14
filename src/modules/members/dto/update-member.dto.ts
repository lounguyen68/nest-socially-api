import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMemberDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  p: string;

  @IsString()
  @IsNotEmpty()
  g: string;

  @IsString()
  @IsNotEmpty()
  publicKey: string;
}
