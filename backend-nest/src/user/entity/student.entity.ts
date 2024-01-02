import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';
import { ParticipantInterface } from '../interface/participant.interface';

@ChildEntity()
export class Student extends User implements ParticipantInterface {
  constructor(username: string, validate: boolean) {
    super(username, validate);
  }

  getUserType() {
    if (!this.validate) return UserType.NOT_CHOOSE;
    return UserType.STUDENT;
  }

  equals(user: User): boolean {
    return super.equals(user);
  }
}
