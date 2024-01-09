import { UserService } from './user.service';
import { Teacher } from '../entity/teacher.entity';
import { TestBed } from '@automock/jest';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import {
  generateAdminMock,
  generateRandomUserMockList,
  generateStudentMock,
  generateTeacherMock,
} from '../../../test/mock/user.mock';
import { SortUserParam } from '../constants/sortUserParam.enum';
import { SortOrder } from '../../constants/sortOrder.enum';
import { UserType } from '../constants/userType.constant';
import { Student } from '../entity/student.entity';
import { NotValidatedUserException } from '../exception/notValidatedUser.exception';
import { UserNotFoundException } from '../../auth/exception/userNotFound.exception';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  let teacherMock = generateTeacherMock();
  let userMockList = generateRandomUserMockList(20);
  const userDeletedMockList = generateRandomUserMockList(20, true);
  let adminMock = generateAdminMock();
  let studentMock = generateStudentMock();
  let notValidatedTeacherMock = generateTeacherMock(false, false);
  const notValidatedStudentMock = generateStudentMock(false, false);

  beforeEach(() => {
    teacherMock = generateTeacherMock();
    userMockList = generateRandomUserMockList(20);
    adminMock = generateAdminMock();
    studentMock = generateStudentMock();
    notValidatedTeacherMock = generateTeacherMock(false, false);
  });

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile();

    service = unit;
    userRepository = unitRef.get('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // tests functions of user.service.ts
  // createUser
  describe('createUser', () => {
    it('should create a user', async () => {
      const user = teacherMock;
      userRepository.save.mockResolvedValue(user);
      await service.createUser(
        user.username,
        user.name,
        user.surname,
        user.getUserType(),
        user.validate,
      );
      expect(userRepository.save).toBeCalledWith(user);
    });

    it('should create a user with validate equals false', async () => {
      const user = notValidatedTeacherMock;
      userRepository.save.mockResolvedValue(user);
      await service.createUser(
        user.username,
        user.name,
        user.surname,
        user.getUserType(),
      );
      expect(userRepository.save).toBeCalledWith(user);
    });
  });

  // getUsersPerPage
  describe('getUsersPerPage', () => {
    it('should get users per page', async () => {
      const page = 1;
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;
      const onePageUserMockList: User[] = userMockList.slice(
        skip,
        itemsPerPage,
      );
      userRepository.find.mockResolvedValue(onePageUserMockList);
      const test = await service.getUsersPerPage(page, itemsPerPage);
      expect(userRepository.find).toBeCalledWith({
        skip,
        take: itemsPerPage,
      });
      expect(test).toEqual(onePageUserMockList);
      expect(test).toHaveLength(itemsPerPage);
    });
  });

  // getUsersPerPageSorted
  describe('getUsersPerPageSorted', () => {
    it('should get users per page sorted', async () => {
      const page = 1;
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;
      userRepository.find.mockResolvedValue(userMockList);
      const test = await service.getUsersPerPageSorted(
        page,
        itemsPerPage,
        SortUserParam.USERNAME,
        SortOrder.ASC,
      );
      expect(userRepository.find).toBeCalledWith({
        skip,
        take: itemsPerPage,
        order: {
          [SortUserParam.USERNAME]: SortOrder.ASC,
        },
        where: {
          deleted: false,
        },
      });
      expect(test).toEqual(userMockList);
      expect(test).toHaveLength(userMockList.length);
      expect(test).toBeInstanceOf(Array);
    });
    it('should get users per page sorted with deleted', async () => {
      const page = 1;
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;
      userRepository.find.mockResolvedValue(userDeletedMockList);
      const test = await service.getUsersPerPageSorted(
        page,
        itemsPerPage,
        SortUserParam.USERNAME,
        SortOrder.ASC,
        true,
      );
      expect(userRepository.find).toBeCalledWith({
        skip,
        take: itemsPerPage,
        order: {
          [SortUserParam.USERNAME]: SortOrder.ASC,
        },
        where: {
          deleted: true,
        },
      });
      expect(test).toEqual(userDeletedMockList);
      expect(test).toHaveLength(userDeletedMockList.length);
      expect(test).toBeInstanceOf(Array);
    });
  });

  // getUser
  describe('getUser', () => {
    it('should get a user', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.getUser(user.id);
      expect(userRepository.findOneBy).toBeCalledWith({ id: user.id });
      expect(test).toEqual(user);
      expect(test).toBeInstanceOf(User);
    });
  });

  // getUserByUsername
  describe('getUserByUsername', () => {
    it('should get a user by username', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.getUserByUsername(user.username);
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: false,
      });
      expect(test).toEqual(user);
      expect(test).toBeInstanceOf(User);
    });
    it('should get a user by username with deleted', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.getUserByUsername(user.username, true);
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: true,
      });
      expect(test).toEqual(user);
      expect(test).toBeInstanceOf(User);
    });
  });

  // usernameNotUsed
  describe('usernameNotUsed', () => {
    it('should return true if username is not used', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(null);
      const test = await service.usernameNotUsed(user.username);
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: false,
      });
      expect(test).toEqual(true);
    });
    it('should return false if username is used', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.usernameNotUsed(user.username);
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: false,
      });
      expect(test).toEqual(false);
    });
  });

  // getUserForLogin
  describe('getUserForLogin', () => {
    it('should get a user for login', async () => {
      const user = studentMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.getUserForLogin(user.username);
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: false,
      });
      expect(test).toEqual(user);
      expect(test).toBeInstanceOf(User);
    });
    it('should create a user for login', async () => {
      const user = adminMock;
      userRepository.findOneBy.mockResolvedValue(null);
      const newUser = new Student(user.username, false);
      userRepository.save.mockResolvedValue(newUser);
      const test = await service.getUserForLogin(user.username);
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: false,
      });
      expect(userRepository.save).toBeCalledWith(newUser);
      expect(test.username).toEqual(user.username);
      expect(test).toBeInstanceOf(User);
      expect(test.getUserType()).toEqual(UserType.NOT_CHOOSE);
    });
    it('should throw an error if user is not validated', async () => {
      const user = notValidatedTeacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      await expect(service.getUserForLogin(user.username)).rejects.toThrow(
        NotValidatedUserException,
      );
      expect(userRepository.findOneBy).toBeCalledWith({
        username: user.username,
        deleted: false,
      });
    });
  });

  // updateUser
  describe('updateUser', () => {
    it('should update a user', async () => {
      const user = teacherMock;
      const baseUser = new Teacher(user.username, user.validate);
      baseUser.name = user.name;
      baseUser.surname = user.surname;
      const name = 'name';
      const surname = 'surname';
      userRepository.save.mockResolvedValue(user);
      await service.updateUser(user, name, surname);
      expect(userRepository.save).toBeCalledWith(user);
      expect(userRepository.save).not.toBeCalledWith(baseUser);
    });
  });

  // deleteSoftUser
  describe('deleteSoftUser', () => {
    it('should soft delete a user', async () => {
      const user = teacherMock;
      const baseUser = new Teacher(user.username, user.validate);
      baseUser.name = user.name;
      baseUser.surname = user.surname;
      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user);
      await service.deleteSoftUser(user.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.deleted).toEqual(true);
      expect(user.name).not.toEqual(baseUser.name);
      expect(user.surname).not.toEqual(baseUser.surname);
    });
  });

  //deleteUser
  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const user = teacherMock;
      userRepository.delete.mockResolvedValue(null);
      await service.deleteUser(user.id);
      expect(userRepository.delete).toBeCalledWith({ id: user.id });
    });
  });

  // validateUser
  describe('validateUser', () => {
    it('should validate a user', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      await service.validateUser(user.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.validate).toEqual(true);
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(service.validateUser(user.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  //selfValidate
  describe('selfValidate', () => {
    it('should create a Teacher if is a Teacher', async () => {
      const user = notValidatedStudentMock;
      userRepository.delete.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(user);
      await service.selfValidate(
        user,
        user.name,
        user.surname,
        UserType.TEACHER,
      );
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.validate).toEqual(false);
    });
    it('should validate a Student if is a Student', async () => {
      const user = notValidatedStudentMock;
      userRepository.delete.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(user);
      await service.selfValidate(
        user,
        user.name,
        user.surname,
        UserType.STUDENT,
      );
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.validate).toEqual(true);
    });
  });

  // getNbUsersPage
  describe('getNbUsersPage', () => {
    it('should get the number of users per page', async () => {
      const nbItem = 100;
      const nbItemPerPage = 10;
      userRepository.count.mockResolvedValue(nbItem);
      const nbPage = Math.ceil(nbItem / nbItemPerPage);
      const test = await service.getNbUsersPage(nbItemPerPage);
      expect(userRepository.count).toBeCalled();
      expect(test).toEqual(nbPage);
    });
    it('should get the number of users per page with deleted', async () => {
      const nbItem = 100;
      const nbItemPerPage = 10;
      userRepository.count.mockResolvedValue(nbItem);
      const nbPage = Math.ceil(nbItem / nbItemPerPage);
      const test = await service.getNbUsersPage(nbItemPerPage, true);
      expect(userRepository.count).toBeCalledWith({ where: { deleted: true } });
      expect(test).toEqual(nbPage);
    });
  });

  // isUserValidated
  describe('isUserValidated', () => {
    it('should return true if user is validated', async () => {
      const user = studentMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.isUserValidated(user.id);
      expect(userRepository.findOneBy).toBeCalledWith({ id: user.id });
      expect(test).toEqual(true);
    });
    it('should return false if user is not validated', async () => {
      const user = notValidatedStudentMock;
      userRepository.findOneBy.mockResolvedValue(user);
      const test = await service.isUserValidated(user.id);
      expect(userRepository.findOneBy).toBeCalledWith({ id: user.id });
      expect(test).toEqual(false);
    });
    it('should throw an error if user is not found', async () => {
      const user = studentMock;
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(service.isUserValidated(user.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
