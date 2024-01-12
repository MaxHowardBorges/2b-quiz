import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';

@ChildEntity()
export class Admin extends User {
  constructor(username: string, validate: boolean) {
    super(username, validate);
  }
  getUserType() {
    return UserType.ADMIN;
  }

  equals(user: User): boolean {
    return this.id === user.id && this.getUserType() === user.getUserType();
  }
}
