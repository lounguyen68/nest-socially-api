import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './interfaces/conversation.interface';
import { Member } from '../members/interfaces/member.interface';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(Member.name)
    private readonly memberModel: Model<Member>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { type, name, userIds } = createConversationDto;

    if (!userIds || userIds.length < 1) {
      throw new NotFoundException(
        'At least one user must be included in a conversation',
      );
    }

    const conversation = new this.conversationModel({ type, name });

    const membersToAdd = userIds.map((userId) => ({
      user: new Types.ObjectId(userId),
      conversation: conversation._id,
    }));

    const members = await this.memberModel.insertMany(membersToAdd);

    conversation.members = members.map((member) => member._id) as Member[];

    await conversation.save();

    const createdConversation = await this.findById(
      conversation._id.toString(),
      true,
    );

    return createdConversation;
  }

  async findById(
    conversationId: string,
    populateMembers = false,
  ): Promise<Conversation> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new NotFoundException('Invalid conversation ID');
    }

    const query = this.conversationModel.findById(conversationId);

    if (populateMembers) {
      query.populate({
        path: 'members',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
        select: 'lastTimeSeen',
      });
    }

    const conversation = await query.exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async findAllByUserId(userId: string, limit = 10, skip = 0) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const memberConversations = await this.memberModel
      .find({ user: new Types.ObjectId(userId) })
      .select('conversation')
      .exec();

    if (memberConversations.length === 0) {
      return { data: [] };
    }

    const conversationIds = memberConversations.map(
      (member) => member.conversation,
    );

    return await this.conversationModel
      .find({ _id: { $in: conversationIds } })
      .populate({
        path: 'members',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
        select: 'lastTimeSeen',
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findConversationByUserIds(type: number, userIds: string[]) {
    if (!Array.isArray(userIds) || userIds.length < 2) {
      throw new Error('User IDs must include at least two users.');
    }

    const conversations = await this.conversationModel
      .find({
        type,
      })
      .populate({
        path: 'members',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
        select: 'lastTimeSeen',
      })
      .exec();

    const conversation = conversations.find(
      (conversation) =>
        conversation.members.length === userIds.length &&
        conversation.members.every((member) =>
          userIds.includes(member.user._id.toString()),
        ),
    );

    return conversation;
  }
}
