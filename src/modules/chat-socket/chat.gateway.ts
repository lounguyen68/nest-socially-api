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

@WebSocketGateway({
  namespace: 'socket.io',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage(ClientEmitMessages.SEND_MESSAGE)
  handleMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit(ServerEmitMessages.NEW_MESSAGE, data);
  }

  @SubscribeMessage(ClientEmitMessages.CREATE_CONVERSATION)
  handleConversation(
    @MessageBody() data: Conversation,
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit(ServerEmitMessages.NEW_CONVERSATION, data);
  }
}
