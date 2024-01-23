import { IsArray, IsInt } from 'class-validator';

export class WhitelistDto {
  @IsArray()
  @IsInt({ each: true })
  whitelist: number[];
}
