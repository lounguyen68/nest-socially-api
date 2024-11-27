import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import {
  Conversation,
  ConversationSchema,
} from './interfaces/conversation.interface';
import { MembersModule } from '../members/members.module';
import { Member, MemberSchema } from '../members/interfaces/member.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
    MembersModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
