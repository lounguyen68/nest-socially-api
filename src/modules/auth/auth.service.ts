import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserDto } from '../users/dto/user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    return plainToClass(UserDto, user.toObject());
  }

  async login(userData: LoginUserDto): Promise<LoginResponseDto> {
    const { name, password } = userData;
    const user = await this.usersService.findByUsername(name);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.deviceToken = userData.deviceToken;

    await user.save();

    let userResponse = {
      ...user.toObject(),
      password: undefined,
    };
    const payload = { _id: user._id, name: user.name };

    return {
      user: plainToClass(UserDto, userResponse),
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '3d' }),
    };
  }
}
