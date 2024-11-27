import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './interfaces/conversation.interface';
import { MembersService } from '../members/members.service';
import { Member } from '../members/interfaces/member.interface';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(Member.name)
    private readonly memberModel: Model<Member>, // Inject thêm Member model để truy vấn
    private readonly membersService: MembersService,
  ) {}

  /**
   * Create a new conversation and add initial members.
   * @param createConversationDto DTO containing type, name, and userIds
   * @returns Created conversation
   */
  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { type, name, userIds } = createConversationDto;

    // Kiểm tra userIds
    if (!userIds || userIds.length < 1) {
      throw new NotFoundException(
        'At least one user must be included in a conversation',
      );
    }

    // Tạo conversation
    const conversation = new this.conversationModel({
      type,
      name,
      members: userIds,
    });

    const createdConversation = await conversation.save();

    // Thêm thành viên vào conversation
    await this.membersService.addMembers({
      conversationId: createdConversation._id.toString(),
      userIds,
    });

    return createdConversation;
  }

  async findById(
    conversationId: string,
    populateMembers = false,
  ): Promise<Conversation> {
    const query = this.conversationModel.findById(conversationId);

    if (populateMembers) {
      query.populate({
        path: 'members',
        select: 'userId lastTimeSeen',
      });
    }

    const conversation = await query.exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async findAllByUser(userId: string, limit: number, skip: number) {
    // Kiểm tra userId hợp lệ
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    // Tìm tất cả conversations mà user là thành viên
    const members = await this.memberModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('conversationId')
      .exec();

    if (members.length === 0) {
      return {
        data: [],
      };
    }

    // Truy vấn conversation theo danh sách conversationIds
    const conversations = await this.conversationModel
      .find()
      .populate({
        path: 'members',
        populate: {
          path: 'userId', // Populate thông tin từ User
          select: 'name email avatar', // Chỉ lấy các trường cần thiết từ User
        },
        select: 'lastTimeSeen', // Lấy các trường cần thiết từ Member
      })
      // .find({ 'members.userId': userId }) // Lọc conversation chứa userId trong members
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data: conversations,
    };
  }
}
