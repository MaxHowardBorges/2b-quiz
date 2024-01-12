import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { UserSession } from './userSession.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Questionnary)
  @JoinColumn()
  questionnary: Questionnary;

  @OneToMany(() => UserSession, (userSession) => userSession.id)
  userSession: UserSession;

  //TODO IMPLEMENT USER
  /*@ManyToOne(() => Teacher, (teacher) => teacher.id)
  teacher: Teacher;*/

  @Column()
  teacher: string;

  @Column()
  isResult: boolean;

  @Column()
  isGlobal: boolean;
  @Column()
  isAvailableAfter: boolean;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  date: Date;
}
