import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interface';
import { File } from '../files/interfaces/file.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageType } from 'src/common/const';
import { Conversation } from '../conversations/interfaces/conversation.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(File.name) private fileModel: Model<File>,
  ) {}

  async getMessages(
    conversationId: string,
    limit: number,
    skip: number,
  ): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'sender',
        populate: {
          path: 'user',
          select: 'name email avatarPath',
        },
      })
      .exec();

    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        if ([MessageType.IMAGE, MessageType.FILE].includes(message.type)) {
          return await message.populate('attachments');
        }

        return message;
      }),
    );

    return populatedMessages;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { attachments, ...messageData } = createMessageDto;

    const message = new this.messageModel(messageData);

    if (
      [MessageType.FILE, MessageType.IMAGE].includes(createMessageDto.type) &&
      createMessageDto.attachments?.length
    ) {
      const files = await this.fileModel.insertMany(
        attachments.map((file) => ({
          ...file,
          message: message._id,
        })),
      );
      message.attachments = files.map((file) => file._id) as File[];
    }

    const newMessage = await message.save();

    await this.conversationModel.findByIdAndUpdate(newMessage.conversation, {
      lastMessage: newMessage._id,
    });

    newMessage.attachments = attachments;

    return newMessage;
  }
}
