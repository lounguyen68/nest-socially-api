import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetMessagesDto } from './dto/get-messages.dto';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  async getMessages(@Query() paginationQuery: GetMessagesDto, @Req() req) {
    const { conversationId, limit, skip } = paginationQuery;

    // Kiểm tra conversationId có hợp lệ không
    if (!conversationId) {
      throw new BadRequestException('conversationId is required.');
    }

    const messages = await this.messagesService.getMessages(
      conversationId,
      Number(limit),
      Number(skip),
    );

    return {
      success: true,
      data: messages,
    };
  }

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.createMessage(createMessageDto);

    return {
      success: true,
      data: message,
    };
  }
}
