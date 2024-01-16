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
import { Teacher } from '../../user/entity/teacher.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Questionnary)
  @JoinColumn()
  questionnary: Questionnary;

  @OneToMany(() => UserSession, (userSession) => userSession.id)
  userSession: UserSession[];

  @ManyToOne(() => Teacher, (teacher) => teacher.id)
  teacher: Teacher;

  @Column()
  isResult: boolean;

  @Column()
  isGlobal: boolean;
  @Column()
  isResponses: boolean;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  date: Date;
}
