import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';
import { ParticipantInterface } from '../interface/participant.interface';

@ChildEntity()
export class Teacher extends User implements ParticipantInterface {
  constructor(username: string, validate: boolean) {
    super(username, validate);
  }

  getUserType() {
    return UserType.TEACHER;
  }

  equals(user: User): boolean {
    return super.equals(user);
  }
}
