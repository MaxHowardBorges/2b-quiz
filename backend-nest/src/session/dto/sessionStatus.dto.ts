import { SettingsDto } from './settings.dto';
import { DisplaySettingsDto } from './displaySettings.dto';

export class SessionStatusDto {
  nbJoined: number;
  nbAnswered: number;
  settings: SettingsDto;
  displaySettings: DisplaySettingsDto;
  whitelist: number[];
}
