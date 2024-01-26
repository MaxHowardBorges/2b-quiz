import { Injectable } from '@nestjs/common';
import { GroupDto } from '../dto/group.dto';
import { Group } from '../entity/group.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class GroupMapper {
  constructor(private readonly userMapper: UserMapper) {}

  mapGroupTab(groups: Group[]) {
    return groups.map((group) => this.mapGroup(group));
  }

  mapGroup(group: Group): GroupDto {
    return {
      groupName: group.groupName,
      id: group.id,
      tabUsers: group.tabUsers,
      teacher: group.teacher,
      nbTabUsers: group.tabUsers.length,
    };
  }
}
