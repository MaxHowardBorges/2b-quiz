import { AccessTypeEnum } from '../enum/accessType.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DisplaySettingsDto } from './displaySettings.dto';
import { Type } from 'class-transformer';

export class SettingsDto {
  @IsNotEmpty()
  @IsEnum(AccessTypeEnum)
  accessType: AccessTypeEnum;

  @IsNotEmpty()
  @Type(() => DisplaySettingsDto)
  displaySettings: DisplaySettingsDto;

  @IsNotEmpty()
  isResult: boolean;

  @IsNotEmpty()
  isGlobal: boolean;

  @IsNotEmpty()
  isResponses: boolean;
}
