import { AccessTypeEnum } from '../enum/accessType.enum';
import { DisplaySettingsObject } from './displaySettings.object';

export class SettingsObject {
  accessType: AccessTypeEnum;
  displaySettings: DisplaySettingsObject;

  isResult: boolean;

  isGlobal: boolean;

  isResponses: boolean;

  constructor(
    displaySettings: DisplaySettingsObject,
    accessType: AccessTypeEnum = AccessTypeEnum.Closed,
    isResult: boolean = false,
    isGlobal: boolean = false,
    isResponses: boolean = false,
  ) {
    this.accessType = accessType;
    this.displaySettings = displaySettings;
    this.isResult = isResult;
    this.isGlobal = isGlobal;
    this.isResponses = isResponses;
  }
}
