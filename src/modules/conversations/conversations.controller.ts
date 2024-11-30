import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetConversationsDto } from './dto/get-conversations.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetConversationDto } from './dto/get-conversation.dto';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async create(
    @Body() createConversationDto: CreateConversationDto,
    @Req() req,
  ) {
    const currentUser = req.user;

    if (
      !createConversationDto.userIds ||
      createConversationDto.userIds.length === 0
    ) {
      throw new BadRequestException(
        'At least one user must be provided to create a conversation.',
      );
    }

    if (!createConversationDto.userIds.includes(currentUser._id)) {
      createConversationDto.userIds.push(currentUser._id);
    }

    const conversation = await this.conversationsService.create(
      createConversationDto,
    );

    return {
      success: true,
      data: conversation,
    };
  }

  @Get('/single')
  async getSingleConversation(@Query() dto: GetConversationDto, @Req() req) {
    const currentUserId = req.user._id;
    const { userId, type } = dto;

    const userIds = [currentUserId, userId];

    const conversation =
      await this.conversationsService.findConversationByUserIds(type, userIds);

    return {
      success: true,
      data: conversation,
    };
  }

  @Get()
  async getConversations(
    @Query() paginationQuery: GetConversationsDto,
    @Req() req,
  ) {
    const { limit = 10, skip = 0 } = paginationQuery;

    const conversations = await this.conversationsService.findAllByUserId(
      req.user._id,
      Number(limit),
      Number(skip),
    );

    return {
      success: true,
      data: conversations,
    };
  }

  @Get(':id')
  async getConversationById(@Param('id') id: string) {
    const conversation = await this.conversationsService.findById(id, true);

    return {
      success: true,
      data: conversation,
    };
  }
}
