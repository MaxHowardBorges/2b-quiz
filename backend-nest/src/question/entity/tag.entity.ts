import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { IsString } from 'class-validator';
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  idTag: number;

  @Column()
  description: string;

  @ManyToMany(() => Question, (question) => question.tags)
  //@JoinTable()
  questions: Question[];
}
