import { IsString } from 'class-validator';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class LoginResponseDto {
  user: UserDto;
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken?: string;
}
