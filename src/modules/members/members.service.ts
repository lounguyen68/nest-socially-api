import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddMembersDto } from './dto/add-members.dto';
import { Member } from './interfaces/member.interface';
import { Conversation } from '../conversations/interfaces/conversation.interface';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async addMembers(addMembersDto: AddMembersDto): Promise<Member[]> {
    const { conversationId, userIds } = addMembersDto;

    const isValidConversationId = Types.ObjectId.isValid(conversationId);
    if (!isValidConversationId) {
      throw new BadRequestException('Invalid conversationId');
    }

    const conversationExists = await this.conversationModel.exists({
      _id: conversationId,
    });
    if (!conversationExists) {
      throw new NotFoundException('Conversation not found');
    }

    const existingMembers = await this.memberModel.find({
      conversationId: new Types.ObjectId(conversationId),
      userId: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    });

    const existingUserIds = existingMembers.map((member) =>
      member.userId.toString(),
    );
    const newUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId),
    );

    if (newUserIds.length === 0) {
      throw new BadRequestException(
        'All users are already members of the conversation',
      );
    }

    const membersToAdd = newUserIds.map((userId) => ({
      userId: new Types.ObjectId(userId),
      conversationId: new Types.ObjectId(conversationId),
    }));

    const membersAdded = await this.memberModel.insertMany(membersToAdd);

    return membersAdded;
  }
}
