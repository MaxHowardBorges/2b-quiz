import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { QuestionType } from '../constants/questionType.constant';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: QuestionType.QCU })
  type: QuestionType;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToOne(() => Questionnary, (questionnary) => questionnary.questions)
  questionnary: Questionnary;
}
