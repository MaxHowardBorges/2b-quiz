import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserFullDataDto } from '../dto/userFullData.dto';
import { UserListDto } from '../dto/userList.dto';
import { UserSelfDataDto } from '../dto/userSelfData.dto';
import { UserDeletedFullDataDto } from '../dto/userDeletedFullData.dto';

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
    return dto;
  }

  userFullDataDtoListMap(users: User[], nbPage: number): UserListDto {
    const userList = [];
    for (let user of users) {
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
    for (let user of users) {
      userList.push(this.userDeleteDtoMap(user));
    }
    return { userList, nbPage };
  }
}
