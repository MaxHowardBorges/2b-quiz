import { ChildEntity } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Student extends User {
  constructor(
    username: string,
    password: string,
    name: string,
    surname: string,
  ) {
    super(username, password, name, surname);
  }
}
