import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';

@ChildEntity()
export class Admin extends User {
  constructor(username: string) {
    super(username);
  }
  getUserType() {
    return UserType.ADMIN;
  }
}
