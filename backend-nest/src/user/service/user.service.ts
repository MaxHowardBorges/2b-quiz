import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entity/student.entity';
import { UserType } from '../constants/userType.constant';
import { Admin } from '../entity/admin.entity';
import { Teacher } from '../entity/teacher.entity';
import { faker } from '@faker-js/faker/locale/fr';
import { UserNotFoundException } from '../../auth/exception/userNotFound.exception';
import { NotValidatedUserException } from '../exception/notValidatedUser.exception';
import { SortUserParam } from '../constants/sortUserParam.enum';
import { SortOrder } from '../../constants/sortOrder.enum';
import { Group } from '../entity/group.entity';
import { GroupNotFoundException } from '../../questionnary/exception/groupNotFound.exception';
import { UserAlreadyJoinedException } from '../../session/exception/userAlreadyJoined.exception';
import { StudentNotInGroupException } from '../exception/studentNotInGroup.exception';
import { CreateGroupDto } from '../dto/createGroup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
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

  async getUsersPerPage(page: number, itemsPerPage: number, deleted: boolean) {
    const skip = (page - 1) * itemsPerPage;
    return await this.userRepository.find({
      skip,
      take: itemsPerPage,
      where: {
        deleted,
      },
    });
  }

  async getUsersPerPageSorted(
    page: number,
    itemsPerPage: number,
    field: SortUserParam,
    order: SortOrder,
    deleted: boolean = false,
  ) {
    const skip = (page - 1) * itemsPerPage;
    return await this.userRepository.find({
      skip,
      take: itemsPerPage,
      order: {
        [field]: order,
      },
      where: {
        deleted,
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

  async deleteSoftUser(idUser: number) {
    const user = await this.getUser(idUser);
    user.name = faker.person.firstName();
    user.surname = faker.person.lastName();
    user.deleted = true;
    user.askedDelete = false;
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

  async getNbUsersPage(nbItem: number, deleted: boolean = false) {
    return Math.ceil(
      (await this.userRepository.count({ where: { deleted } })) / nbItem,
    );
  }

  async isUserValidated(idUser: number) {
    const user = await this.getUser(idUser);
    if (!user) throw new UserNotFoundException();
    return user.validate;
  }

  async restoreUser(idUser: number, name: string, surname: string) {
    const user = await this.getUser(idUser);
    if (!user) throw new UserNotFoundException();
    user.name = name;
    user.surname = surname;
    user.deleted = false;
    await this.userRepository.save(user);
  }

  async askDeleteUser(user: User) {
    user.askedDelete = true;
    await this.userRepository.save(user);
  }

  async rejectAskDeleteUser(idUser: number) {
    const user = await this.getUser(idUser);
    if (!user) throw new UserNotFoundException();
    user.askedDelete = false;
    await this.userRepository.save(user);
  }

  async createGroup(dto: CreateGroupDto) {
    const group: Group = new Group();
    group.groupName = dto.name;
    group.tabStudents = [];
    const t = <Teacher>await this.userRepository.findOne({
      where: { id: dto.idTeacher },
    });
    group.teacher = t;
    t.groups.push(group);
    await this.groupRepository.save(group);
    await this.userRepository.save(t);
  }

  async deleteGroup(idGroup: number) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher'],
      where: { id: idGroup },
    });
    const t = <Teacher>await this.userRepository.findOne({
      where: { id: group.teacher.id },
    });

    if (group) {
      if (group.tabStudents == undefined) {
        const index = t.groups.findIndex((g) => {
          return g.id === idGroup;
        });
        t.groups.splice(index);
        await this.groupRepository.delete(idGroup);
      } else {
        for (let i = 0; i < group.tabStudents.length; i++) {
          const id = group.tabStudents[i].groups.findIndex((g) => {
            return g.id === idGroup;
          });
          group.tabStudents[i].groups.splice(id);
          await this.userRepository.save(group.tabStudents[i]);
        }
        const index = t.groups.findIndex((g) => {
          return g.id === idGroup;
        });
        t.groups.splice(index);
        await this.groupRepository.delete(idGroup);
      }
    } else {
      throw new GroupNotFoundException();
    }
    return !!group;
  }

  async getGroup(idGroup: number) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher', 'tabStudents'],
      where: { id: idGroup },
    });

    if (!group) {
      throw new GroupNotFoundException();
    }
    return group;
  }

  async addStudentToGroup(idGroup: number, idStudent: number) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher', 'tabStudents'],
      where: { id: idGroup },
    });

    const student: Student = <Student>await this.userRepository.findOne({
      relations: ['groups'],
      where: { id: idStudent },
    });

    if (group && student) {
      if (group.tabStudents.length != 0) {
        for (let i = 0; i < group.tabStudents.length; i++) {
          if (group.tabStudents[i].id == student.id) {
            throw new UserAlreadyJoinedException();
          }
        }
      }

      student.groups.push(group);
      group.tabStudents.push(student);

      // console.log(student);
      // console.log(group);
      await this.userRepository.save(student);
      await this.groupRepository.save(group);
    }
    if (!group) {
      throw new GroupNotFoundException();
    }
    if (!student) {
      throw new UserNotFoundException();
    }

    return !!(group && student);
  }

  async removeStudentFromGroup(idGroup: number, idStudent: number) {
    const group = await this.groupRepository.findOne({
      relations: ['tabStudents'],
      where: { id: idGroup },
    });
    const student: Student = <Student>await this.userRepository.findOne({
      relations: ['groups'],
      where: { id: idStudent },
    });

    if (group && student) {
      const groupTabStudent = group.tabStudents;
      const studentGroup = student.groups;

      let isIn = false;
      for (const s of groupTabStudent) {
        if (s.id == idStudent) {
          isIn = true;
        }
      }

      if (isIn) {
        let index = groupTabStudent.findIndex((s) => {
          s.id = student.id;
        });
        groupTabStudent.splice(index);

        index = student.groups.findIndex((g) => {
          return g.id === group.id;
        });
        studentGroup.splice(index);

        await this.userRepository.save(student);
        await this.groupRepository.save(group);
      } else {
        throw new StudentNotInGroupException();
      }
    }

    if (!group) {
      throw new GroupNotFoundException();
    }
    if (!student) {
      throw new UserNotFoundException();
    }

    return !!(group && student);
  }
}
