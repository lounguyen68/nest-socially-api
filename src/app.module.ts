import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth';
import { FilesModule } from './modules/files/files.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MembersModule } from './modules/members/members.module';
import { ChatGateway } from './modules/chat-socket/chat.gateway';
import { NotificationModule } from './modules/notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UsersModule,
    AuthModule,
    FilesModule,
    MessagesModule,
    ConversationsModule,
    MembersModule,
    NotificationModule,
  ],
  providers: [ChatGateway],
  controllers: [],
})
export class AppModule {}
