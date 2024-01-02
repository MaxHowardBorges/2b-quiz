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

  protected constructor(username: string, validate: boolean) {
    this.username = username;
    this.validate = validate;
    this.deleted = false;
  }

  abstract getUserType(): UserType;

  equals(user: User): boolean {
    return this.id === user.id;
  }
}
