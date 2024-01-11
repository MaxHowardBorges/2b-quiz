import { UserFullDataDto } from './userFullData.dto';

export class UserListDto {
  userList: UserFullDataDto[];
  nbPage: number;
}
