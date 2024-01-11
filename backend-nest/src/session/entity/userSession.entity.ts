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

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.id)
  session: Session;

  //TODO IMPLEMENT USER
  /*@ManyToOne(() => User, (user) => user.id)
  user: User;*/
  @Column()
  user: string;

  @ManyToMany(() => Answer)
  @JoinTable()
  answer: Answer[];
}
