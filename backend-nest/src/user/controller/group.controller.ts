import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../constants/userType.constant';
import { UserRequest } from '../../auth/config/user.request';
import { Teacher } from '../entity/teacher.entity';
import { GroupMapper } from '../mapper/group.mapper';
import { DontOwnTheGroup } from '../exception/dontOwnTheGroup';
import { UserAlreadyJoinedException } from '../../session/exception/userAlreadyJoined.exception';
import { StudentNotInGroupException } from '../exception/studentNotInGroup.exception';

@Controller('group')
export class GroupController {
  constructor(
    private readonly userService: UserService,
    private readonly groupMapper: GroupMapper,
  ) {}
  @Roles([UserType.TEACHER])
  @Post('/create')
  async createGroup(@Req() request: UserRequest, @Body('name') name: string) {
    return this.groupMapper.mapGroup(
      await this.userService.createGroup(name, request.user as Teacher),
    );
  }

  @Roles([UserType.TEACHER])
  @Delete('/:id')
  async deleteGroup(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idGroup: number,
  ) {
    if (
      !(await this.userService.isGroupFromTeacher(
        idGroup,
        request.user as Teacher,
      ))
    ) {
      throw new DontOwnTheGroup();
    }
    return this.userService.deleteGroup(idGroup);
  }

  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Get('/:id')
  async getGroup(@Param('id', ParseIntPipe) idGroup: number) {
    return this.groupMapper.mapGroup(await this.userService.getGroup(idGroup));
  }
  @Roles([UserType.TEACHER])
  @Put('/:id/user/:idUser')
  async addUserToGroup(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idGroup: number,
    @Param('idUser', ParseIntPipe) idUser: number,
  ) {
    if (
      !(await this.userService.isGroupFromTeacher(
        idGroup,
        request.user as Teacher,
      ))
    ) {
      throw new DontOwnTheGroup();
    } else if (await this.userService.isAlreadyInGroup(idGroup, idUser)) {
      throw new UserAlreadyJoinedException();
    }
    return this.userService.addUserToGroup(idGroup, idUser);
  }

  @Roles([UserType.TEACHER])
  @Delete('/:id/user/:idUser')
  async removeUserFromGroup(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idGroup: number,
    @Param('idUser', ParseIntPipe) idUser: number,
  ) {
    if (
      !(await this.userService.isGroupFromTeacher(
        idGroup,
        request.user as Teacher,
      ))
    ) {
      throw new DontOwnTheGroup();
    } else if (!(await this.userService.isAlreadyInGroup(idGroup, idUser))) {
      throw new StudentNotInGroupException();
    }
    return this.userService.removeUserFromGroup(idGroup, idUser);
  }

  @Get('/:id/user')
  async getUser(@Param('id', ParseIntPipe) idGroup: number) {
    return this.userService.getUserWithGroup(idGroup);
  }

  @Roles([UserType.TEACHER])
  @Get('')
  async getGroupsFromTeacher(@Req() request: UserRequest) {
    return this.groupMapper.mapGroupTab(
      await this.userService.getGroupsFromTeacher(request.user as Teacher),
    );
  }
}
