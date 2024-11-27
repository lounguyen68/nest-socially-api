import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member, MemberSchema } from './interfaces/member.interface';
import {
  Conversation,
  ConversationSchema,
} from '../conversations/interfaces/conversation.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
