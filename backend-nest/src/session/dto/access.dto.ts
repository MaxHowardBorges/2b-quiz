import { AccessTypeEnum } from '../enum/accessType.enum';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AccessDto {
  @IsEnum(AccessTypeEnum)
  @IsNotEmpty()
  accesType: AccessTypeEnum;

  @IsArray()
  @IsInt({ each: true })
  whitelist: number[];
}
