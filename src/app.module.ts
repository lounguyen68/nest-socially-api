import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthController, AuthModule, AuthService } from './modules/auth';
import { FilesModule, FilesService, FilesController } from './modules/files';
import { MessagesModule } from './modules/messages/messages.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MembersModule } from './modules/members/members.module';

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
  providers: [AuthService, FilesService],
  controllers: [AuthController, FilesController],
})
export class AppModule {}
