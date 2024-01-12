import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../question/entity/question.entity';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Teacher } from '../../user/entity/teacher.entity';

@Entity()
export class Questionnary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.questionnaries)
  author: Teacher;

  @OneToMany(() => Question, (question) => question.questionnary)
  questions: Question[];
}
