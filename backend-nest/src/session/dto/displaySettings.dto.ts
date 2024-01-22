import { IsBoolean, IsNotEmpty } from 'class-validator';

export class DisplaySettingsDto {
  @IsBoolean()
  @IsNotEmpty()
  displayQuestion: boolean;
  @IsNotEmpty()
  @IsBoolean()
  displayAnswer: boolean;
}
