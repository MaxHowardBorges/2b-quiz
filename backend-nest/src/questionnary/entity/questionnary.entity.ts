import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../question/entity/question.entity';

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
