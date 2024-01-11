import { SortUserParam } from '../constants/sortUserParam.enum';
import { SortOrder } from '../../constants/sortOrder.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class SortParamUserDto {
  @IsEnum(SortUserParam)
  @IsOptional()
  field: SortUserParam;

  @IsEnum(SortOrder)
  @IsOptional()
  order: SortOrder;
}
