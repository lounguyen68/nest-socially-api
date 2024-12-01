import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetUsersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  keyword: string;
}
