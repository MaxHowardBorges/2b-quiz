import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  idTag: number;

  @Column()
  description: string;

  //TODO ADD ID AUTHOR
  @Column()
  author: number;

  @ManyToMany(() => Question, (question) => question.tags)
  //@JoinTable()
  questions: Question[];
}
