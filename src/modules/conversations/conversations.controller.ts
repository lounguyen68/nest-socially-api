import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetConversationsDto } from './dto/get-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    // Validate input DTO (userIds must not be empty)
    if (
      !createConversationDto.userIds ||
      createConversationDto.userIds.length === 0
    ) {
      throw new BadRequestException(
        'At least one user must be provided to create a conversation.',
      );
    }

    // Create the conversation and add members
    const conversation = await this.conversationsService.create(
      createConversationDto,
    );

    // Return the created conversation with members populated
    const populatedConversation = await this.conversationsService.findById(
      conversation._id.toString(),
      true,
    );

    return {
      message: 'Conversation created successfully',
      conversation: populatedConversation,
    };
  }

  /**
   * Get all conversations for a user
   * @param paginationQuery Query containing userId, limit, and skip
   * @returns List of conversations
   */
  @Get()
  async getConversations(@Query() paginationQuery: GetConversationsDto) {
    const { userId, limit = 10, skip = 0 } = paginationQuery;

    // Validate userId
    if (!userId) {
      throw new BadRequestException('userId must be provided.');
    }

    return this.conversationsService.findAllByUser(
      userId,
      Number(limit),
      Number(skip),
    );
  }
}
