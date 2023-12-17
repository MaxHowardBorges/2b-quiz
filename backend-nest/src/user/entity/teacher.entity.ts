import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';

@ChildEntity()
export class Teacher extends User {
  constructor(username: string, validate: boolean) {
    super(username, validate);
  }

  getUserType() {
    return UserType.TEACHER;
  }
}
