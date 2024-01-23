import { Teacher } from '../entity/teacher.entity';
import { User } from '../entity/user.entity';

export class GroupDto {
  id: number;

  groupName: string;

  teacher: Teacher;

  tabUsers: User[];

  nbTabUsers: number;
}
