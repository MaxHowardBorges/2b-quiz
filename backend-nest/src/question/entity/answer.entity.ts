import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { userSession } from '../../session/entity/userSession.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @Column()
  content: string;

  @Column()
  isCorrect: boolean;

  @ManyToMany(() => Answer, (answer) => answer.userSession)
  @JoinTable()
  userSession: userSession[];
}
