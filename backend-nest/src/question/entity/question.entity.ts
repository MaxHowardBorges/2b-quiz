import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // type: string;

  @Column()
  content: string;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToOne(() => Questionnary, (questionnary) => questionnary.questions)
  questionnary: Questionnary;
}
