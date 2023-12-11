import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserFullDataDto } from '../dto/userFullData.dto';
import { UserListDto } from '../dto/userList.dto';

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
}
