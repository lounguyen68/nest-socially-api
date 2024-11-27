import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @Transform(({ value }) => +value)
  @IsPositive()
  limit?: number;

  @Transform(({ value }) => +value)
  @Min(0)
  skip?: number;
}
