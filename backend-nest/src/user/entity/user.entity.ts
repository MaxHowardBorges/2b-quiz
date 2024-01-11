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

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ default: false })
  validate: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  askedDelete: boolean;

  protected constructor(username: string, validate: boolean) {
    this.username = username;
    this.validate = validate;
    this.deleted = false;
    this.askedDelete = false;
  }

  abstract getUserType(): UserType;

  abstract equals(user: User): boolean;
}
