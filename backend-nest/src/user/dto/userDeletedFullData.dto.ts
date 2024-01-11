import { UserType } from '../constants/userType.constant';

export class UserDeletedFullDataDto {
  id: number;
  username: string;
  userType: UserType;
}
