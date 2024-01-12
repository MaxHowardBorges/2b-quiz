import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../constants/userType.constant';
import { ParticipantInterface } from '../interface/participant.interface';
import { Group } from './group.entity';
import { IsArray } from 'class-validator';

@ChildEntity()
export class Student extends User implements ParticipantInterface {
  @Column()
  @ManyToMany(() => Group, (group) => group.tabStudents)
  @JoinTable()
  @IsArray()
  groups: Group[];
  constructor(username: string, validate: boolean) {
    super(username, validate);
  }
  getUserType() {
    if (!this.validate) return UserType.NOT_CHOOSE;
    return UserType.STUDENT;
  }

  equals(user: User): boolean {
    return this.id === user.id && this.getUserType() === user.getUserType();
  }
}
