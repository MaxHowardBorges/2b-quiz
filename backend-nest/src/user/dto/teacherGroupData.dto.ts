import { UserType } from '../constants/userType.constant';
import { Group } from '../entity/group.entity';

export class TeacherGroupDataDto {
  id: number;
  username: string;
  name: string;
  surname: string;
  createdGroups: Group[];
}
