import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(userData.name);

    if (user) {
      throw new ConflictException('Username already exists');
    }

    const newUser = new this.userModel(userData);
    await newUser.save();

    newUser.password = undefined;
    return newUser;
  }

  async update(userId: string, userData: any): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    user.avatarPath = userData.avatarPath;

    await user.save();

    user.password = undefined;
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(name: string): Promise<User> {
    return this.userModel.findOne({ name }).exec();
  }
}
