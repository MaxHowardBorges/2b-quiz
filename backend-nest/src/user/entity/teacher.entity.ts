import { ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';
import { ParticipantInterface } from '../interface/participant.interface';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';

@ChildEntity()
export class Teacher extends User implements ParticipantInterface {
  @OneToMany(() => Questionnary, (questionnary) => questionnary.author)
  questionnaries: Questionnary[];

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
