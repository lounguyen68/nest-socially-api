import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}
  @Put('update')
  async updateMember(@Body() data: UpdateMemberDto) {
    return await this.membersService.updateMember(data);
  }
}
