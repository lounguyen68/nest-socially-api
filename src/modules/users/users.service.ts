import {
  ConflictException,
  Injectable,
  NotFoundException,
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
    const user = await this.userModel
      .findByIdAndUpdate(userId, userData, {
        new: true, // Trả về đối tượng đã được cập nhật
        runValidators: true, // Chạy validation nếu có
      })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(
    limit = 10,
    skip = 0,
    currentUserId: string,
    keyword?: string,
  ): Promise<User[]> {
    const filter = {
      _id: { $ne: currentUserId },
      ...(keyword && { name: { $regex: keyword } }),
    };
    return this.userModel
      .find(filter)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(name: string): Promise<User> {
    return this.userModel.findOne({ name }).exec();
  }
}
