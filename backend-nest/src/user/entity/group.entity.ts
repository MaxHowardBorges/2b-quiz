import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Teacher } from './teacher.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.groups)
  @IsNotEmpty()
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.groups)
  tabStudents: Student[];
}
