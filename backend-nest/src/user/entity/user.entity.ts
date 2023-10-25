import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { UserType } from '../constants/userType.constant';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ default: false })
  validate: boolean;

  protected constructor(
    username: string,
    password: string,
    name: string,
    surname: string,
  ) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.validate = false;
  }

  abstract getUserType(): UserType;
}
