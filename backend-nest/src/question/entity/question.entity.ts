import {
  Column,
  Entity,
  JoinColumn,
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
import { Teacher } from '../../user/entity/teacher.entity';

@Entity()
export class Question {
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

  /*@ManyToOne(() => Question, (question) => question.id, { nullable: true })
  originalId?: number;*/

  // @OneToMany(() => Question, (question) => question.id, { nullable: true })
  // duplicates: Question[];

  @ManyToOne(() => Question, { nullable: true })
  @JoinColumn({ name: 'originalId' })
  originalQuestion?: Question;

  @Column({ nullable: true })
  originalId?: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.questions)
  author: Teacher;

  equals(question: Question): boolean {
    return this.id === question.id;
  }
}
