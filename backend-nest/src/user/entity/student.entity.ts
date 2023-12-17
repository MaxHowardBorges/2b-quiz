import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';

@ChildEntity()
export class Student extends User {
  constructor(username: string, validate: boolean) {
    super(username, validate);
  }

  getUserType() {
    if (!this.validate) return UserType.NOT_CHOOSE;
    return UserType.STUDENT;
  }
}
