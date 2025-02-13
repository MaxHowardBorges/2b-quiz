import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserFullDataDto } from '../dto/userFullData.dto';
import { UserListDto } from '../dto/userList.dto';
import { UserSelfDataDto } from '../dto/userSelfData.dto';
import { UserDeletedFullDataDto } from '../dto/userDeletedFullData.dto';
import { TeacherGroupDataDto } from '../dto/teacherGroupData.dto';
import { PartialUserDto } from '../dto/partialUser.dto';

@Injectable()
export class UserMapper {
  userFullDataDtoMap(user: User) {
    const dto = new UserFullDataDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.name = user.name;
    dto.surname = user.surname;
    dto.validate = user.validate;
    dto.userType = user.getUserType();
    dto.askedDelete = user.askedDelete;
    return dto;
  }

  userFullDataDtoListMap(users: User[], nbPage: number): UserListDto {
    const userList = [];
    for (const user of users) {
      userList.push(this.userFullDataDtoMap(user));
    }
    return { userList, nbPage };
  }

  userSelfDataDtoMap(user: User): UserSelfDataDto {
    const dto = new UserSelfDataDto();
    dto.username = user.username;
    dto.name = user.name;
    dto.surname = user.surname;
    dto.userType = user.getUserType();
    return dto;
  }

  userDeleteDtoMap(user: User): UserDeletedFullDataDto {
    const dto = new UserDeletedFullDataDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.userType = user.getUserType();
    return dto;
  }

  userDeleteDtoListMap(users: User[], nbPage: number): UserListDto {
    const userList = [];
    for (const user of users) {
      userList.push(this.userDeleteDtoMap(user));
    }
    return { userList, nbPage };
  }

  teacherGroupDataDtoMap(user: User) {
    const dto = new TeacherGroupDataDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.name = user.name;
    dto.surname = user.surname;
    return dto;
  }

  partialUserDtoMap(user: User) {
    const dto = new PartialUserDto();
    dto.id = user.id;
    dto.username = user.username;
    dto.name = user.name;
    dto.surname = user.surname;
    return dto;
  }

  partialUserDtoListMap(users: User[]): PartialUserDto[] {
    const userList = [];
    for (const user of users) {
      userList.push(this.partialUserDtoMap(user));
    }
    return userList;
  }
}
