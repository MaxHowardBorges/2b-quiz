import { Group } from '../entity/group.entity';
import { UserType } from '../constants/userType.constant';
import { DefaultValuePipe } from '@nestjs/common';

export class TeacherGroupDto {
  id: number;
  name: string;
  surname: string;
  username: string;
  validate: boolean | null;
  userType: string | null;
  askedDelete: boolean | null;
  createdGroups: Group[] = [];
  joinedGroups: Group[] = [];

  getUserType() {
    return UserType.TEACHER;
  }
}
