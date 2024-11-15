import { IsString, IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(5, 20, { message: 'Name must be between 5 and 20 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
