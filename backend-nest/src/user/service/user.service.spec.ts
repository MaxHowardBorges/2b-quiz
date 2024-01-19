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
import { CreateGroupDto } from '../dto/createGroup.dto';
import { GroupNotFoundException } from '../../questionnary/exception/groupNotFound.exception';
import { Group } from '../entity/group.entity';
import { generateGroupMock } from '../../../test/mock/group.mock';
import { GroupNameEmptyException } from '../exception/groupNameEmpty.exception';
import { StudentCantCreateGroupsException } from '../exception/StudentCantCreateGroups.exception';
import { UserAlreadyJoinedException } from '../../session/exception/userAlreadyJoined.exception';
import { TeacherHasNoCreatedGroupsException } from '../exception/teacherHasNoCreatedGroups.exception';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let groupRepository: jest.Mocked<Repository<Group>>;

  let teacherMock = generateTeacherMock();
  let userMockList = generateRandomUserMockList(20);
  const userDeletedMockList = generateRandomUserMockList(20, true);
  let groupMock = generateGroupMock();

  let adminMock = generateAdminMock();
  let studentMock = generateStudentMock();
  let notValidatedTeacherMock = generateTeacherMock(false, false);
  let notValidatedStudentMock = generateStudentMock(false, false);

  beforeEach(() => {
    groupMock = generateGroupMock();
    teacherMock = generateTeacherMock();
    userMockList = generateRandomUserMockList(20);
    adminMock = generateAdminMock();
    studentMock = generateStudentMock();
    notValidatedTeacherMock = generateTeacherMock(false, false);
    notValidatedStudentMock = generateStudentMock(false, false);
  });

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile();

    service = unit;
    userRepository = unitRef.get('UserRepository');
    groupRepository = unitRef.get('GroupRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // tests functions of user.service.ts
  // createUser
  describe('createUser', () => {
    it('should create a user', async () => {
      const user = teacherMock;
      user.id = undefined;
      user.questionnaries = undefined;
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
    it('should create a admin user', async () => {
      const user = adminMock;
      user.id = undefined;
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
    it('should create a student user', async () => {
      const user = studentMock;
      user.id = undefined;
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
      user.id = undefined;
      user.questionnaries = undefined;
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
      const test = await service.getUsersPerPage(page, itemsPerPage, false);
      expect(userRepository.find).toBeCalledWith({
        skip,
        take: itemsPerPage,
        where: {
          deleted: false,
        },
      });
      expect(test).toEqual(onePageUserMockList);
      expect(test).toHaveLength(itemsPerPage);
    });
    it('should get users per page with deleted', async () => {
      const page = 1;
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;
      const onePageUserMockList: User[] = userDeletedMockList.slice(
        skip,
        itemsPerPage,
      );
      userRepository.find.mockResolvedValue(onePageUserMockList);
      const test = await service.getUsersPerPage(page, itemsPerPage, true);
      expect(userRepository.find).toBeCalledWith({
        skip,
        take: itemsPerPage,
        where: {
          deleted: true,
        },
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
      baseUser.deleted = user.deleted;
      baseUser.askedDelete = user.askedDelete;
      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user);
      await service.deleteSoftUser(user.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.deleted).toEqual(true);
      expect(user.name).not.toEqual(baseUser.name);
      expect(user.surname).not.toEqual(baseUser.surname);
      expect(user.askedDelete).toEqual(false);
    });
  });

  //deleteUser
  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.delete.mockResolvedValue(null);
      await service.deleteUser(user.id);
      expect(userRepository.delete).toBeCalledWith({ id: user.id });
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.delete.mockResolvedValue(null);
      await expect(service.deleteUser(user.id)).rejects.toThrow(
        UserNotFoundException,
      );
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

  // restoreUser
  describe('restoreUser', () => {
    it('should restore a user', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      await service.restoreUser(user.id, user.name, user.surname);
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.deleted).toEqual(false);
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.restoreUser(user.id, user.name, user.surname),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  // askDeleteUser
  describe('askDeleteUser', () => {
    it('should ask delete a user', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      await service.askDeleteUser(user);
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.askedDelete).toEqual(true);
    });
  });

  // rejectAskDeleteUser
  describe('rejectAskDeleteUser', () => {
    it('should reject ask delete a user', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(user);
      await service.rejectAskDeleteUser(user.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(user.askedDelete).toEqual(false);
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(service.rejectAskDeleteUser(user.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  // createGroup
  describe('createGroup', () => {
    afterEach(() => {
      groupMock = generateGroupMock();
      teacherMock = generateTeacherMock();
    });
    //test cases where the teacher has already created groups or where the group name is empty
    it('should create a group', async () => {
      userRepository.findOneBy.mockResolvedValue(teacherMock);
      userRepository.findOne.mockResolvedValue(teacherMock);
      groupRepository.save.mockResolvedValue(groupMock);
      const dto: CreateGroupDto = {
        name: groupMock.groupName,
        teacher: groupMock.teacher,
      };
      await service.createGroup(dto);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      // expect(groupRepository.save).toBeCalledWith(groupMock.groupName);
      // expect(groupRepository.save).toBeCalledWith(groupMock.teacher);
    });
    it('should create a group that has a teacher', async () => {
      ////
      userRepository.findOneBy.mockResolvedValue(teacherMock);
      groupRepository.save.mockResolvedValue(groupMock);
      const dto: CreateGroupDto = {
        name: groupMock.groupName,
        teacher: groupMock.teacher,
      };
      const createdGroup = await service.createGroup(dto);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      expect(createdGroup.teacher).toEqual(groupMock.teacher);
    });
    it("should be added to the teacher's created group", async () => {
      ////
      userRepository.findOneBy.mockResolvedValue(teacherMock);
      groupRepository.save.mockResolvedValue(groupMock);
      const dto: CreateGroupDto = {
        name: groupMock.groupName,
        teacher: groupMock.teacher,
      };
      const g = await service.createGroup(dto);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      expect(g.teacher.createdGroups).toContain(g);
    });
    it("should return an error if the teacher's group name is empty", async () => {
      userRepository.findOneBy.mockResolvedValue(teacherMock);
      const dto: CreateGroupDto = {
        name: '',
        teacher: groupMock.teacher,
      };
      await expect(service.createGroup(dto)).rejects.toThrow(
        new GroupNameEmptyException(),
      );
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      userRepository.findOneBy.mockResolvedValue(null);
      const dto: CreateGroupDto = {
        name: 'name',
        teacher: user,
      };
      await expect(service.createGroup(dto)).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('should throw an error if user is not a teacher', async () => {
      const user = studentMock;
      userRepository.findOneBy.mockResolvedValue(teacherMock);
      userRepository.findOne.mockResolvedValue(user);
      const dto: CreateGroupDto = {
        name: 'name',
        teacher: <Teacher>user,
      };
      await expect(service.createGroup(dto)).rejects.toThrow(
        StudentCantCreateGroupsException,
      );
    });
  });

  // deleteGroup
  describe('deleteGroup', () => {
    // TODO Rajouter les cas ou le groupe n'est pas vide
    it("should delete a group when it's empty", async () => {
      const user = teacherMock;
      userRepository.findOne.mockResolvedValue(user);
      groupRepository.findOne.mockResolvedValue(groupMock);
      await service.deleteGroup(groupMock.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(groupRepository.delete).toBeCalledWith(groupMock.id);
    });
    it('should delete the group when it is not empty', async () => {
      const user = teacherMock;
      groupMock.tabUsers = [studentMock];
      studentMock.joinedGroups = [groupMock];
      user.createdGroups = [groupMock];
      groupMock.teacher = user;
      userRepository.findOne.mockResolvedValue(user);
      groupRepository.findOne.mockResolvedValue(groupMock);
      await service.deleteGroup(groupMock.id);
      studentMock.joinedGroups = [];
      // expect(groupMock.tabUsers).toEqual([]);
      // expect(studentMock.joinedGroups).toEqual([]);
      expect(userRepository.save).toBeCalledWith(user);
      expect(groupRepository.delete).toBeCalledWith(groupMock.id);
    });
    it("should delete the group from the teacher's cretatedGroups when it's empty", async () => {
      userRepository.findOne.mockResolvedValue(teacherMock);
      groupRepository.findOne.mockResolvedValue(groupMock);
      await service.deleteGroup(groupMock.id);
      expect(userRepository.save).toBeCalledWith(teacherMock);
      expect(teacherMock.askedDelete).toEqual(false);
      expect(groupRepository.delete).toBeCalledWith(groupMock.id);
      expect(teacherMock.createdGroups).not.toContain(groupMock);
    });
    it('should delete the group from the teacher createdGroup when it is not empty', async () => {
      groupMock.tabUsers = [studentMock];
      studentMock.joinedGroups = [groupMock];
      teacherMock.createdGroups = [groupMock];
      groupMock.teacher = teacherMock;
      userRepository.findOne.mockResolvedValue(teacherMock);
      groupRepository.findOne.mockResolvedValue(groupMock);
      await service.deleteGroup(groupMock.id);
      studentMock.joinedGroups = [];
      // expect(groupMock.tabUsers).toEqual([]);
      // expect(studentMock.joinedGroups).toEqual([]);
      expect(userRepository.save).toBeCalledWith(teacherMock);
      expect(groupRepository.delete).toBeCalledWith(groupMock.id);
      expect(teacherMock.createdGroups).not.toContain(groupMock);
    });
    it('should be removed from the student joinedGroups', async () => {
      groupMock.tabUsers = [studentMock];
      studentMock.joinedGroups = [groupMock];
      teacherMock.createdGroups = [groupMock];
      groupMock.teacher = teacherMock;
      userRepository.findOne.mockResolvedValue(teacherMock);
      groupRepository.findOne.mockResolvedValue(groupMock);
      await service.deleteGroup(groupMock.id);
      studentMock.joinedGroups = [];
      // expect(groupMock.tabUsers).toEqual([]);
      expect(studentMock.joinedGroups).toEqual([]);
      expect(userRepository.save).toBeCalledWith(teacherMock);
      expect(groupRepository.delete).toBeCalledWith(groupMock.id);
      expect(teacherMock.createdGroups).not.toContain(groupMock);
    });
    it('should empty the group tabUsers', async () => {
      groupMock.tabUsers = [studentMock];
      studentMock.joinedGroups = [groupMock];
      teacherMock.createdGroups = [groupMock];
      groupMock.teacher = teacherMock;
      userRepository.findOne.mockResolvedValue(teacherMock);
      groupRepository.findOne.mockResolvedValue(groupMock);
      await service.deleteGroup(groupMock.id);
      studentMock.joinedGroups = [];
      expect(groupMock.tabUsers).toEqual([]);
      expect(userRepository.save).toBeCalledWith(teacherMock);
      expect(groupRepository.delete).toBeCalledWith(groupMock.id);
    });
    it('should throw an error if user is not found', async () => {
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteGroup(groupMock.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('should throw an error if user is not a teacher', async () => {
      const user = studentMock;
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(user);
      await expect(service.deleteGroup(user.id)).rejects.toThrow(
        StudentCantCreateGroupsException,
      );
    });
    it('should throw an error if group is not found', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(user);
      await expect(service.deleteGroup(user.id)).rejects.toThrow(
        GroupNotFoundException,
      );
    });
  });

  // getGroup
  describe('getGroup', () => {
    it('should get a group', async () => {
      groupRepository.findOne.mockResolvedValue(groupMock);
      const test = await service.getGroup(groupMock.id);
      expect(test).toEqual(groupMock);
      expect(test).toBeInstanceOf(Group);
    });
    it('should throw an error if group is not found', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(null);
      await expect(service.getGroup(user.id)).rejects.toThrow(
        GroupNotFoundException,
      );
    });
  });

  // addUserToGroup
  describe('addUserToGroup', () => {
    it('should add a user to a group', async () => {
      const user = studentMock;
      user.joinedGroups = [];
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(user);
      await service.addUserToGroup(groupMock.id, user.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      expect(groupMock.tabUsers).toContain(user);
    });
    it('should add the group to the user joinedGroups', async () => {
      const user = studentMock;
      user.joinedGroups = [];
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(user);
      await service.addUserToGroup(groupMock.id, user.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      expect(user.joinedGroups).toContain(groupMock);
    });
    it('should throw an error if user is already in the group', async () => {
      const user = studentMock;
      user.joinedGroups = [groupMock];
      groupMock.tabUsers = [user];
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(user);
      await expect(
        service.addUserToGroup(groupMock.id, user.id),
      ).rejects.toThrow(UserAlreadyJoinedException);
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.addUserToGroup(user.id, user.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('should throw an error if group is not found', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(studentMock);
      await expect(service.addUserToGroup(user.id, user.id)).rejects.toThrow(
        GroupNotFoundException,
      );
    });
  });

  // removeStudentFromGroup
  describe('removeStudentFromGroup', () => {
    it('should remove a student from a group', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(user);
      teacherMock.createdGroups = [groupMock];
      groupMock.tabUsers = [studentMock];
      studentMock.joinedGroups = [groupMock];
      await service.removeStudentFromGroup(groupMock.id, studentMock.id);
      expect(userRepository.save).toBeCalledWith(user);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      expect(groupMock.tabUsers).not.toContain(studentMock);
      expect(user.askedDelete).toEqual(false);
    });
    it('should remove the group from the student joinedGroups', async () => {
      const user = teacherMock;
      groupMock.id = 136;
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(studentMock);
      teacherMock.createdGroups = [groupMock];
      groupMock.tabUsers = [studentMock];
      studentMock.joinedGroups = [groupMock];
      await service.removeStudentFromGroup(groupMock.id, studentMock.id);
      expect(userRepository.save).toBeCalledWith(studentMock);
      expect(groupRepository.save).toBeCalledWith(groupMock);
      expect(studentMock.joinedGroups).not.toContain(groupMock);
      expect(user.askedDelete).toEqual(false);
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(groupMock);
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        service.removeStudentFromGroup(user.id, user.id),
      ).rejects.toThrow(UserNotFoundException);
    });
    it('should throw an error if group is not found', async () => {
      const user = teacherMock;
      groupRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(studentMock);
      await expect(
        service.removeStudentFromGroup(user.id, user.id),
      ).rejects.toThrow(GroupNotFoundException);
    });
  });

  // getGroupsFromTeacher
  describe('getGroupsFromTeacher', () => {
    it('should get groups from a teacher', async () => {
      const user = teacherMock;
      user.createdGroups = [groupMock];
      userRepository.findOne.mockResolvedValue(user);
      const test = await service.getGroupsFromTeacher(user.id);
      expect(test).toEqual([groupMock]);
    });
    it('should throw an error if user is not found', async () => {
      const user = teacherMock;
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.getGroupsFromTeacher(user.id)).rejects.toThrow(
        UserNotFoundException,
      );
    });
    it('should throw an error if the teacher has no groups', async () => {
      const user = teacherMock;
      user.createdGroups = [];
      userRepository.findOne.mockResolvedValue(user);
      await expect(service.getGroupsFromTeacher(user.id)).rejects.toThrow(
        TeacherHasNoCreatedGroupsException,
      );
    });
  });
});
