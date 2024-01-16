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
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column()
  groupName: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.createdGroups)
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.joinedGroups)
  tabUsers: User[];
}
