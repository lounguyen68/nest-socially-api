import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth';
import { FilesService } from './modules/files/files.service';
import { FilesController } from './modules/files/files.controller';
import { FilesModule } from './modules/files/files.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MembersModule } from './modules/members/members.module';
import { ChatGateway } from './modules/chat-socket/chat.gateway';

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
  ],
  providers: [ChatGateway],
  controllers: [],
})
export class AppModule {}
