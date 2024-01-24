import { IsBoolean } from 'class-validator';

export class ResultsSettingsDto {
  @IsBoolean()
  isGlobal: boolean;
  @IsBoolean()
  isResult: boolean;
  @IsBoolean()
  isResponses: boolean;
}
