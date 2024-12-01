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
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log('Message received: ', data);
    client.emit(ServerEmitMessages.NEW_MESSAGE, `Server received: ${data}`);
    return `Server received: ${data}`;
  }
}
