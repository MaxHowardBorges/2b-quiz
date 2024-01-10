import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Questionnary, (questionnary) => questionnary.id)
  questionnary: Questionnary;

  //TODO IMPLEMENT USER
  /*@ManyToOne(() => Teacher, (teacher) => teacher.id)
  teacher: Teacher;*/

  @Column()
  isResult: boolean;

  @Column()
  isGlobal: boolean;
  @Column()
  isAvailableAfter: boolean;
}
