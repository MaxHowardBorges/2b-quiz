import { TestBed } from '@automock/jest';
import { UserMapper } from './user.mapper';
import { User } from '../entity/user.entity';
import { generateRandomUserMockList } from '../../../test/mock/user.mock';

describe('UserMapper', () => {
  let mapper: UserMapper;
  let userMock: User[];
  let deletedUserMock: User[];

  beforeAll(() => {
    const { unit } = TestBed.create(UserMapper).compile();
    mapper = unit;
  });

  beforeEach(() => {
    userMock = generateRandomUserMockList(10);
    deletedUserMock = generateRandomUserMockList(10, true);
  });

  // userFullDataDtoMap
  describe('userFullDataDtoMap', () => {
    it('should return a UserFullDataDto', () => {
      const user = userMock[0];
      const dto = mapper.userFullDataDtoMap(user);
      expect(dto.id).toEqual(user.id);
      expect(dto.username).toEqual(user.username);
      expect(dto.name).toEqual(user.name);
      expect(dto.surname).toEqual(user.surname);
      expect(dto.validate).toEqual(user.validate);
      expect(dto.userType).toEqual(user.getUserType());
      expect(dto.askedDelete).toEqual(user.askedDelete);
    });
  });

  // userFullDataDtoListMap
  describe('userFullDataDtoListMap', () => {
    it('should return a UserListDto', () => {
      const dto = mapper.userFullDataDtoListMap(userMock, 10);
      expect(dto.nbPage).toEqual(10);
      expect(dto.userList.length).toEqual(10);
      for (let i = 0; i < 10; i++) {
        expect(dto.userList[i].id).toEqual(userMock[i].id);
        expect(dto.userList[i].username).toEqual(userMock[i].username);
        expect(dto.userList[i].name).toEqual(userMock[i].name);
        expect(dto.userList[i].surname).toEqual(userMock[i].surname);
        expect(dto.userList[i].validate).toEqual(userMock[i].validate);
        expect(dto.userList[i].userType).toEqual(userMock[i].getUserType());
        expect(dto.userList[i].askedDelete).toEqual(userMock[i].askedDelete);
      }
    });
  });

  // userSelfDataDtoMap
  describe('userSelfDataDtoMap', () => {
    it('should return a UserSelfDataDto', () => {
      const user = userMock[0];
      const dto = mapper.userSelfDataDtoMap(user);
      expect(dto.username).toEqual(user.username);
      expect(dto.name).toEqual(user.name);
      expect(dto.surname).toEqual(user.surname);
      expect(dto.userType).toEqual(user.getUserType());
    });
  });

  // userDeleteDtoMap
  describe('userDeleteDtoMap', () => {
    it('should return a UserDeletedFullDataDto', () => {
      const user = deletedUserMock[0];
      const dto = mapper.userDeleteDtoMap(user);
      expect(dto.id).toEqual(user.id);
      expect(dto.username).toEqual(user.username);
      expect(dto.userType).toEqual(user.getUserType());
    });
  });

  // userDeleteDtoListMap
  describe('userDeleteDtoListMap', () => {
    it('should return a UserListDto', () => {
      const dto = mapper.userDeleteDtoListMap(deletedUserMock, 10);
      expect(dto.nbPage).toEqual(10);
      expect(dto.userList.length).toEqual(10);
      for (let i = 0; i < 10; i++) {
        expect(dto.userList[i].id).toEqual(deletedUserMock[i].id);
        expect(dto.userList[i].username).toEqual(deletedUserMock[i].username);
        expect(dto.userList[i].userType).toEqual(
          deletedUserMock[i].getUserType(),
        );
      }
    });
  });

  // teacherGroupDataDtoMap
  describe('teacherGroupDataDtoMap', () => {
    it('should return a TeacherGroupDataDto', () => {
      const user = userMock[0];
      const dto = mapper.teacherGroupDataDtoMap(user);
      expect(dto.id).toEqual(user.id);
      expect(dto.username).toEqual(user.username);
      expect(dto.name).toEqual(user.name);
      expect(dto.surname).toEqual(user.surname);
    });
  });

  // partialUserDtoMap
  describe('partialUserDtoMap', () => {
    it('should return a PartialUserDto', () => {
      const user = userMock[0];
      const dto = mapper.partialUserDtoMap(user);
      expect(dto.id).toEqual(user.id);
      expect(dto.username).toEqual(user.username);
      expect(dto.name).toEqual(user.name);
      expect(dto.surname).toEqual(user.surname);
    });
  });

  // partialUserDtoListMap
  describe('partialUserDtoListMap', () => {
    it('should return a PartialUserDto list', () => {
      const dto = mapper.partialUserDtoListMap(userMock);
      expect(dto.length).toEqual(10);
      for (let i = 0; i < 10; i++) {
        expect(dto[i].id).toEqual(userMock[i].id);
        expect(dto[i].username).toEqual(userMock[i].username);
        expect(dto[i].name).toEqual(userMock[i].name);
        expect(dto[i].surname).toEqual(userMock[i].surname);
      }
    });
  });

  // userFullDataDtoMap
  describe('userFullDataDtoMap', () => {
    it('should return a UserFullDataDto', () => {
      const user = userMock[0];
      const dto = mapper.userFullDataDtoMap(user);
      expect(dto.id).toEqual(user.id);
      expect(dto.username).toEqual(user.username);
      expect(dto.name).toEqual(user.name);
      expect(dto.surname).toEqual(user.surname);
      expect(dto.validate).toEqual(user.validate);
      expect(dto.userType).toEqual(user.getUserType());
      expect(dto.askedDelete).toEqual(user.askedDelete);
    });
  });

  // userFullDataDtoListMap
  describe('userFullDataDtoListMap', () => {
    it('should return a UserListDto', () => {
      const dto = mapper.userFullDataDtoListMap(userMock, 10);
      expect(dto.nbPage).toEqual(10);
      expect(dto.userList.length).toEqual(10);
      for (let i = 0; i < 10; i++) {
        expect(dto.userList[i].id).toEqual(userMock[i].id);
        expect(dto.userList[i].username).toEqual(userMock[i].username);
        expect(dto.userList[i].name).toEqual(userMock[i].name);
        expect(dto.userList[i].surname).toEqual(userMock[i].surname);
        expect(dto.userList[i].validate).toEqual(userMock[i].validate);
        expect(dto.userList[i].userType).toEqual(userMock[i].getUserType());
        expect(dto.userList[i].askedDelete).toEqual(userMock[i].askedDelete);
      }
    });
  });

  // userSelfDataDtoMap
  describe('userSelfDataDtoMap', () => {
    it('should return a UserSelfDataDto', () => {
      const user = userMock[0];
      const dto = mapper.userSelfDataDtoMap(user);
      expect(dto.username).toEqual(user.username);
      expect(dto.name).toEqual(user.name);
      expect(dto.surname).toEqual(user.surname);
      expect(dto.userType).toEqual(user.getUserType());
    });
  });

  // userDeleteDtoMap
  describe('userDeleteDtoMap', () => {
    it('should return a UserDeletedFullDataDto', () => {
      const user = deletedUserMock[0];
      const dto = mapper.userDeleteDtoMap(user);
      expect(dto.id).toEqual(user.id);
      expect(dto.username).toEqual(user.username);
      expect(dto.userType).toEqual(user.getUserType());
    });
  });

  // userDeleteDtoListMap
  describe('userDeleteDtoListMap', () => {
    it('should return a UserListDto', () => {
      const dto = mapper.userDeleteDtoListMap(deletedUserMock, 10);
      expect(dto.nbPage).toEqual(10);
      expect(dto.userList.length).toEqual(10);
      for (let i = 0; i < 10; i++) {
        expect(dto.userList[i].id).toEqual(deletedUserMock[i].id);
        expect(dto.userList[i].username).toEqual(deletedUserMock[i].username);
        expect(dto.userList[i].userType).toEqual(
          deletedUserMock[i].getUserType(),
        );
      }
    });
  });
});
