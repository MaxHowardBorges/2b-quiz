import { AccessTypeEnum } from '../enum/accessType.enum';

export class AccessDto {
  accesType: AccessTypeEnum;
  whitelist: number[];
}
