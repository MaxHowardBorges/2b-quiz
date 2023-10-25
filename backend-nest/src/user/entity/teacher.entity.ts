import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';

@ChildEntity()
export class Teacher extends User {
  constructor(
    username: string,
    password: string,
    name: string,
    surname: string,
  ) {
    super(username, password, name, surname);
  }

  getUserType() {
    return UserType.TEACHER;
  }
}
