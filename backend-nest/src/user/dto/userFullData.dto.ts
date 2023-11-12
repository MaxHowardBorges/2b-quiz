import { UserType } from '../constants/userType.constant';

export class UserFullDataDto {
  id: number;
  username: string;
  name: string;
  surname: string;
  validate: boolean;
  userType: UserType;
}
