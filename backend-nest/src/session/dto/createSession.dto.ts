import { SettingsDto } from './settings.dto';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsNotEmpty({ each: true })
  @IsArray()
  questionnaryList: number[];

  @IsNotEmpty()
  @Type(() => SettingsDto)
  settings: SettingsDto;

  @IsOptional()
  @IsArray()
  whitelist?: number[];

  @IsOptional()
  @IsArray()
  whitelistGroups?: number[];
}
