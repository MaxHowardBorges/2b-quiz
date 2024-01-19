import { AccessTypeEnum } from '../enum/accessType.enum';

export class SettingsObject {
  accessType: AccessTypeEnum;

  constructor(accessType: AccessTypeEnum = AccessTypeEnum.Public) {
    this.accessType = accessType;
  }
}
