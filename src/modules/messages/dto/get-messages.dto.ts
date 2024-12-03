import { IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetMessagesDto extends PaginationQueryDto {
  @IsString()
  conversationId: string;
}
