import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Teacher } from '../../user/entity/teacher.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  idTag: number;

  @Column()
  description: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.tags)
  author: Teacher;

  @ManyToMany(() => Question, (question) => question.tags)
  //@JoinTable()
  questions: Question[];
}
