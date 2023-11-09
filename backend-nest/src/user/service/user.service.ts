import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entity/student.entity';
import { UserType } from '../constants/userType.constant';
import { Admin } from '../entity/admin.entity';
import { Teacher } from '../entity/teacher.entity';
import { BcryptService } from '../../bcrypt/service/bcrypt.service';
import { InvalidPasswordException } from '../exception/invalidPassword.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}
  async createUser(
    username: string,
    name: string,
    surname: string,
    password: string,
    userType: UserType,
  ) {
    const passwordHash = await this.bcryptService.hashPassword(password);
    let user: User;
    switch (userType) {
      case UserType.ADMIN:
        user = new Admin(username, passwordHash, name, surname);
        break;
      case UserType.STUDENT:
        user = new Student(username, passwordHash, name, surname);
        break;
      case UserType.TEACHER:
        user = new Teacher(username, passwordHash, name, surname);
        break;
    }
    await this.userRepository.save(user);
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async usernameNotUsed(username: string) {
    return !(await this.getUserByUsername(username));
  }

  async updateUser(
    user: User,
    name: string,
    surname: string,
    password: string,
  ) {
    if (!(await this.bcryptService.validatePassword(password, user.password)))
      throw new InvalidPasswordException();
    if (user.surname !== surname) user.surname = surname;
    if (user.name !== name) user.name = name;
    await this.userRepository.save(user);
  }
}
