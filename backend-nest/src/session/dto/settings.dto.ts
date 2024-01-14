import { AccessTypeEnum } from '../enum/accessType.enum';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class SettingsDto {
  @IsNotEmpty()
  @IsEnum(AccessTypeEnum)
  accessType: AccessTypeEnum;

  @IsNotEmpty()
  @IsBoolean()
  isDisplayAnswer: boolean;
}
