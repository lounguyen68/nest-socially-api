import { IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetConversationsDto extends PaginationQueryDto {
  @IsString()
  userId: string;
}
