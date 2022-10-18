import { IsNumber } from "class-validator";
import { Type } from 'class-transformer';

export class PageI {
  @Type(() => Number)
  @IsNumber()
  page: number;
  @Type(() => Number)
  @IsNumber()
  limit: number;
}