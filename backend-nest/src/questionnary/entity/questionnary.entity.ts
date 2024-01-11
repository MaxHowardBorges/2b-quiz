import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../question/entity/question.entity';
import { Session } from '../../session/entity/session.entity';

@Entity()
export class Questionnary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column() //TODO DEFINE AS A FOREIGN KEY
  author: string;

  @OneToMany(() => Question, (question) => question.questionnary)
  questions: Question[];
}
