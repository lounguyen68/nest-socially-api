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

@WebSocketGateway({
  namespace: 'socket.io',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}
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
    const userId = client.data.user?._id;
    const conversationId = data.conversation.toString();
    const isInChatRoom = client.rooms.has(conversationId);

    if (isInChatRoom) {
      await this.memberModel.updateOne(
        { user: userId, conversation: conversationId },
        { lastTimeSeen: data.updatedAt },
      );
    }

    client.broadcast.emit(ServerEmitMessages.NEW_MESSAGE, data);
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
    client.leave(conversationId);
  }

  @SubscribeMessage(ClientEmitMessages.UPDATE_MEMBER)
  async handleUpdateMember(
    @MessageBody() member: Member,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit(ServerEmitMessages.NEW_CONVERSATION, {
      member: member,
      conversationId: member.conversation,
    });
  }
}
