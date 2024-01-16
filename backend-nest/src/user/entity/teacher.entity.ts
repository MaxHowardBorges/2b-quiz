import { ChildEntity, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';
import { ParticipantInterface } from '../interface/participant.interface';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Group } from './group.entity';
import { IsArray } from 'class-validator';

@ChildEntity()
export class Teacher extends User implements ParticipantInterface {
  @OneToMany(() => Questionnary, (questionnary) => questionnary.author)
  questionnaries: Questionnary[];

  @OneToMany(() => Group, (group) => group.teacher)
  createdGroups: Group[];

  @ManyToMany(() => Group, (group) => group.tabUsers)
  @JoinTable()
  joinedGroups: Group[];

  constructor(username: string, validate: boolean) {
    super(username, validate);
  }

  getUserType() {
    return UserType.TEACHER;
  }

  equals(user: User): boolean {
    return this.id === user.id && this.getUserType() === user.getUserType();
  }
}
