import { UserType } from '../constants/userType.constant';

export class UserSelfDataDto {
  username: string;
  name: string;
  surname: string;
  userType: UserType;
}
