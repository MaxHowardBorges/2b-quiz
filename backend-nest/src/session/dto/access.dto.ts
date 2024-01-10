import { AccessTypeEnum } from '../enum/accessType.enum';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AccessDto {
  @IsEnum(AccessTypeEnum)
  @IsNotEmpty()
  accesType: AccessTypeEnum;

  @IsArray()
  @IsString({ each: true })
  whitelist: string[];
}
