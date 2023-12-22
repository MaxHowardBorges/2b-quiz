import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { QuestionType } from '../constants/questionType.constant';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Tag } from './tag.entity';

@Entity()
export class Question {
  idAuthor: number;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: QuestionType.QCU })
  type: QuestionType;

  @ManyToMany(() => Tag, (tag) => tag.questions)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToOne(() => Questionnary, (questionnary) => questionnary.questions)
  questionnary: Questionnary;
}
