import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from '../session';
import { Answer } from '../../question/entity/answer.entity';

@Entity()
export class userSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.id)
  session: Session;

  //TODO IMPLEMENT USER
  /*@ManyToOne(() => User, (user) => user.id)
  user: User;*/

  @ManyToMany(() => Answer, (answer) => answer.userSession)
  @JoinTable()
  answer: Answer[];
}
