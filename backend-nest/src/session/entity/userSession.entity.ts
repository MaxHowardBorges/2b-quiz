import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from '../../question/entity/answer.entity';
import { Session } from './session.entity';
import { Student } from '../../user/entity/student.entity';
import { Teacher } from '../../user/entity/teacher.entity';
import { notNull } from 'jest-mock-extended';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.userSession)
  session: Session;

  @ManyToOne(() => Student, (student) => student.id, { nullable: true })
  student: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.id, { nullable: true })
  teacher: Teacher;

  @ManyToMany(() => Answer, { nullable: true })
  @JoinTable()
  answer: Answer[];
}
