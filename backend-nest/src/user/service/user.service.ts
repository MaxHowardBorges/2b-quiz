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
import { AdminCantJoinException } from '../exception/adminCantJoin.exception';

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

  async getUserWithGroup(idUser: number) {
    if (
      (<User>(
        await this.userRepository.findOne({ where: { id: idUser } })
      )).getUserType() == UserType.TEACHER
    ) {
      return await this.userRepository.findOne({
        relations: ['joinedGroups', 'createdGroups'],
        where: { id: idUser },
      });
    }
    return await this.userRepository.findOne({
      relations: ['joinedGroups'],
      where: { id: idUser },
    });
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
    group.tabUsers = [];
    const t = <Teacher>await this.userRepository.findOne({
      relations: ['createdGroups'],
      where: { id: dto.idTeacher },
    });
    group.teacher = t;
    t.createdGroups.push(group);
    await this.groupRepository.save(group);
    await this.userRepository.save(t);
  }

  async deleteGroup(idGroup: number) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher', 'tabUsers'],
      where: { id: idGroup },
    });
    const t = <Teacher>await this.userRepository.findOne({
      relations: ['createdGroups'],
      where: { id: group.teacher.id },
    });

    if (group) {
      if (group.tabUsers == undefined) {
        const index = t.createdGroups.findIndex((g) => {
          return g.id === idGroup;
        });
        t.createdGroups.splice(index);

        await this.userRepository.save(t);
        await this.groupRepository.delete(idGroup);
      } else {
        for (let i = 0; i < group.tabUsers.length; i++) {
          await this.removeStudentFromGroup(idGroup, group.tabUsers[i].id);
        }
        const index = t.createdGroups.findIndex((g) => {
          return g.id === idGroup;
        });
        t.createdGroups.splice(index);
        await this.userRepository.save(t);
        await this.groupRepository.delete(idGroup);
      }
    } else {
      throw new GroupNotFoundException();
    }
    return !!group;
  }

  async getGroup(idGroup: number) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher', 'tabUsers'],
      where: { id: idGroup },
    });

    if (!group) {
      throw new GroupNotFoundException();
    }
    return group;
  }

  async addUserToGroup(idGroup: number, idStudent: number) {
    const group = await this.groupRepository.findOne({
      relations: ['teacher', 'tabUsers'],
      where: { id: idGroup },
    });

    const user: User = <Student>await this.userRepository.findOne({
      relations: ['joinedGroups'],
      where: { id: idStudent },
    });

    if (user.getUserType() == UserType.ADMIN) {
      throw new AdminCantJoinException();
    }

    if (group && user) {
      if (group.tabUsers.length != 0) {
        for (let i = 0; i < group.tabUsers.length; i++) {
          if (group.tabUsers[i].id == user.id) {
            throw new UserAlreadyJoinedException();
          }
        }
      }

      (<Student>user).joinedGroups.push(group);
      group.tabUsers.push(user);

      await this.userRepository.save(user);
      await this.groupRepository.save(group);
    }
    if (!group) {
      throw new GroupNotFoundException();
    }
    if (!user) {
      throw new UserNotFoundException();
    }

    return !!(group && user);
  }

  async removeStudentFromGroup(idGroup: number, idStudent: number) {
    const group = await this.groupRepository.findOne({
      relations: ['tabUsers'],
      where: { id: idGroup },
    });
    const user: User = <Student>await this.userRepository.findOne({
      relations: ['joinedGroups'],
      where: { id: idStudent },
    });

    if (group && user) {
      const groupTabUsers = group.tabUsers;
      const studentGroup = (<Student>user).joinedGroups;

      let isIn = false;
      for (const s of groupTabUsers) {
        if (s.id == idStudent) {
          isIn = true;
        }
      }

      if (isIn) {
        let index = groupTabUsers.findIndex((s) => {
          s.id = user.id;
        });
        groupTabUsers.splice(index);

        index = (<Student>user).joinedGroups.findIndex((g) => {
          return g.id === group.id;
        });
        studentGroup.splice(index);

        await this.userRepository.save(user);
        await this.groupRepository.save(group);
      } else {
        throw new StudentNotInGroupException();
      }
    }

    if (!group) {
      throw new GroupNotFoundException();
    }
    if (!user) {
      throw new UserNotFoundException();
    }
    return !!(group && user);
  }
}
