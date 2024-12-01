import { Controller, Post, Body, HttpCode, Put, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginData: LoginUserDto) {
    const data = await this.authService.login(loginData);

    return { success: true, data };
  }

  @Put('token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(refreshTokenDto);
    return { success: true, data: tokens };
  }

  @Delete('logout')
  async logout() {
    return { success: true };
  }
}
