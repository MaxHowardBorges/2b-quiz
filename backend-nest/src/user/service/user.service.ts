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
import { NewPasswordNotDifferent } from '../exception/newPasswordNotDifferent.exception';
import { UsernameAlreadyUsedException } from '../exception/usernameAlreadyUsed.exception';
import { InvalidUsernameConfirmationException } from '../exception/invalidUsernameConfirmation.exception';
import { faker } from '@faker-js/faker';

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

  async getUser(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByUsername(username: string, deleted: boolean = false) {
    return await this.userRepository.findOneBy({ username, deleted });
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

  async updateUserPassword(
    user: User,
    oldPassword: string,
    newPassword: string,
  ) {
    if (
      !(await this.bcryptService.validatePassword(oldPassword, user.password))
    )
      throw new InvalidPasswordException();
    if (await this.bcryptService.validatePassword(newPassword, user.password))
      throw new NewPasswordNotDifferent();
    user.password = await this.bcryptService.hashPassword(newPassword);
    await this.userRepository.save(user);
  }

  async updateUserUsername(user: User, username: string, password: string) {
    if (!(await this.bcryptService.validatePassword(password, user.password)))
      throw new InvalidPasswordException();
    if (!(await this.usernameNotUsed(username)))
      throw new UsernameAlreadyUsedException();
    user.username = username;
    await this.userRepository.save(user);
  }

  async deleteUser(user: User, username: string, password: string) {
    if (!(await this.bcryptService.validatePassword(password, user.password)))
      throw new InvalidPasswordException();
    if (username !== user.username)
      throw new InvalidUsernameConfirmationException();
    user.password = '';
    user.name = faker.person.firstName();
    user.surname = faker.person.lastName();
    user.username = faker.internet.userName({
      firstName: user.name,
      lastName: user.surname,
    });
    user.deleted = true;
    await this.userRepository.save(user);
  }
}
