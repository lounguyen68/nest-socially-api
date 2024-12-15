import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ClientEmitMessages, ServerEmitMessages } from './chat.const';
import { Message } from '../messages/interfaces/message.interface';
import { Conversation } from '../conversations/interfaces/conversation.interface';
import * as jwt from 'jsonwebtoken';
import { Member } from '../members/interfaces/member.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationService } from '../notifications/notification.service';
import { ConversationsService } from '../conversations/conversations.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'socket.io',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private conversationMap = new Map<string, string[]>();
  private readonly logger = new Logger(ChatGateway.name);
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    private readonly notificationService: NotificationService,
    private readonly conversationService: ConversationsService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      client.data.user = decoded;
    } catch (error) {
      console.error('Token invalid:', error.message);
    }
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage(ClientEmitMessages.SEND_MESSAGE)
  async handleMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const conversationId = data.conversation.toString();
    const isInChatRoom = client.rooms.has(conversationId);

    if (isInChatRoom) {
      await this.memberModel.updateOne(
        { user: user?.id, conversation: conversationId },
        { lastTimeSeen: data.updatedAt },
      );
    }

    client.broadcast.emit(ServerEmitMessages.NEW_MESSAGE, data);

    let pushTokens = [];

    const conversation = await this.conversationService.findById(
      conversationId,
      true,
    );

    const receiverMember = conversation.members.find(
      (member) => member.user._id !== user?._id,
    );

    const userIdsInConversation = this.conversationMap.get(conversationId);

    if (
      receiverMember &&
      !userIdsInConversation?.includes(receiverMember.user._id as string)
    ) {
      pushTokens.push(receiverMember.user.deviceToken);
    }

    const notificationMessage =
      this.notificationService.createNotificationMessage(user?.name, data);

    await this.notificationService.sendNotifications(
      pushTokens,
      notificationMessage,
    );
  }

  @SubscribeMessage(ClientEmitMessages.CREATE_CONVERSATION)
  handleConversation(
    @MessageBody() data: Conversation,
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit(ServerEmitMessages.NEW_CONVERSATION, data);
  }

  @SubscribeMessage(ClientEmitMessages.JOIN_CONVERSATION)
  async handleJoinConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user?._id;

    if (!this.conversationMap.has(conversationId)) {
      this.conversationMap.set(conversationId, []);
    }

    const usersInConversation = this.conversationMap.get(conversationId);

    if (usersInConversation && !usersInConversation.includes(userId)) {
      usersInConversation.push(userId);
    }

    await this.memberModel.updateOne(
      { user: userId, conversation: conversationId },
      { lastTimeSeen: new Date() },
    );
    client.join(conversationId);
  }

  @SubscribeMessage(ClientEmitMessages.OUT_CONVERSATION)
  async handleOutConversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user?._id as string;
    const usersInConversation = this.conversationMap.get(conversationId);
    if (usersInConversation) {
      this.conversationMap.set(
        conversationId,
        usersInConversation.filter((id) => id !== userId),
      );
    }
    client.leave(conversationId);
  }

  @SubscribeMessage(ClientEmitMessages.UPDATE_CONVERSATION)
  async handleUpdateMember(
    @MessageBody() conversation: Conversation,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit(ServerEmitMessages.UPDATE_CONVERSATION, {
      conversation,
    });
  }
}
