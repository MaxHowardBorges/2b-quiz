import { AccessTypeEnum } from '../enum/accessType.enum';

export class SettingsObject {
  accessType: AccessTypeEnum;

  isDisplayAnswer: boolean;

  constructor(
    accessType: AccessTypeEnum = AccessTypeEnum.Public,
    isDisplayAnswer: boolean = false,
  ) {
    this.accessType = accessType;
    this.isDisplayAnswer = isDisplayAnswer;
  }
}
