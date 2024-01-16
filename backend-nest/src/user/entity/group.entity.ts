import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { IsInt } from 'class-validator';
import { Teacher } from './teacher.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column()
  groupName: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.groups)
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.groups)
  tabStudents: Student[];
}
