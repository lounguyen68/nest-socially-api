import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UpdateAvatarUserDto } from './dto/update-avatar-user.dto';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Req() req, @Query() query: GetUsersDto) {
    const currentUserId = req.user._id;
    const { limit, skip, keyword } = query;
    const users = await this.usersService.findAll(
      limit,
      skip,
      currentUserId,
      keyword,
    );

    return {
      success: true,
      data: users,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-avatar')
  async updateAvatar(@Body() userData: UpdateAvatarUserDto, @Request() req) {
    const userId = req.user._id;

    const user = await this.usersService.update(userId, userData);

    return {
      success: true,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('device-token')
  async updateDeviceToken(
    @Body() userData: UpdateDeviceTokenDto,
    @Request() req,
  ): Promise<User> {
    const userId = req.user._id;

    return this.usersService.update(userId, userData);
  }
}
