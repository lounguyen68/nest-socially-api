import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
