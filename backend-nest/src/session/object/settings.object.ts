import { AccessTypeEnum } from '../enum/accessType.enum';
import { DisplaySettingsObject } from './displaySettings.object';

export class SettingsObject {
  accessType: AccessTypeEnum;
  displaySettings: DisplaySettingsObject;

  constructor(
    displaySettings: DisplaySettingsObject,
    accessType: AccessTypeEnum = AccessTypeEnum.Closed,
  ) {
    this.accessType = accessType;
    this.displaySettings = displaySettings;
  }
}
