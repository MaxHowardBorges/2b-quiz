import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entity/student.entity';
import { UserType } from '../constants/userType.constant';
import { Admin } from '../entity/admin.entity';
import { Teacher } from '../entity/teacher.entity';
import { InvalidUsernameConfirmationException } from '../exception/invalidUsernameConfirmation.exception';
import { faker } from '@faker-js/faker';
import { UserNotFoundException } from '../../auth/exception/userNotFound.exception';
import { NotValidatedUserException } from '../exception/notValidatedUser.exception';
import { SortUserParam } from '../constants/sortUserParam.enum';
import { SortOrder } from '../../constants/sortOrder.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createUser(
    username: string,
    name: string,
    surname: string,
    userType: UserType,
    validate: boolean = false,
  ) {
    let user: User;
    switch (userType) {
      case UserType.ADMIN:
        user = new Admin(username, validate);
        break;
      case UserType.STUDENT:
        user = new Student(username, validate);
        break;
      case UserType.TEACHER:
        user = new Teacher(username, validate);
        break;
    }
    user.surname = surname;
    user.name = name;
    await this.userRepository.save(user);
  }

  async getUsersPerPage(page: number, itemsPerPage: number) {
    const skip = (page - 1) * itemsPerPage;
    return await this.userRepository.find({
      skip,
      take: itemsPerPage,
    });
  }

  async getUsersPerPageSorted(
    page: number,
    itemsPerPage: number,
    field: SortUserParam,
    order: SortOrder,
  ) {
    const skip = (page - 1) * itemsPerPage;
    return await this.userRepository.find({
      skip,
      take: itemsPerPage,
      order: {
        [field]: order,
      },
    });
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

  async getUserForLogin(username: string) {
    const user = await this.getUserByUsername(username, false);
    if (user) {
      if (!user.validate) throw new NotValidatedUserException();
      return user;
    }
    const newUser = new Student(username, false);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(user: User, name: string, surname: string) {
    if (user.surname !== surname) user.surname = surname;
    if (user.name !== name) user.name = name;
    await this.userRepository.save(user);
  }

  async deleteSelfUser(user: User, username: string) {
    if (username !== user.username)
      throw new InvalidUsernameConfirmationException();
    user.name = faker.person.firstName();
    user.surname = faker.person.lastName();
    user.username = faker.internet.userName({
      firstName: user.name,
      lastName: user.surname,
    });
    user.deleted = true;
    await this.userRepository.save(user);
  }

  async deleteUser(idUser: number) {
    if (!(await this.getUser(idUser))) throw new UserNotFoundException();
    await this.userRepository.delete({ id: idUser });
  }

  async validateUser(idUser: number) {
    const user = await this.getUser(idUser);
    if (!user) throw new UserNotFoundException();
    user.validate = true;
    await this.userRepository.save(user);
  }

  async selfValidate(
    user: User,
    name: string,
    surname: string,
    userType: UserType.STUDENT | UserType.TEACHER,
  ) {
    const ancientId = user.id;
    await this.userRepository.delete(user.id);
    if (userType === UserType.STUDENT) {
      user.validate = true;
    } else {
      user = new Teacher(user.username, false);
    }
    user.id = ancientId;
    user.name = name;
    user.surname = surname;
    await this.userRepository.save(user);
  }

  async getNbUsersPage(nbItem: number) {
    return Math.ceil((await this.userRepository.count()) / nbItem);
  }
}
