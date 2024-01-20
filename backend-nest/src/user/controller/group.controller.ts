import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserMapper } from '../mapper/user.mapper';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../constants/userType.constant';
import { CreateGroupDto } from '../dto/createGroup.dto';
import { AddStudentToGroupDto } from '../dto/addStudentToGroup.dto';
import { RemoveStudentFromGroupDto } from '../dto/removeStudentFromGroup.dto';
import { UserRequest } from '../../auth/config/user.request';
import { Teacher } from '../entity/teacher.entity';
import { TeacherMapper } from '../mapper/teacher.mapper';
import { DontOwnTheGroup } from '../exception/dontOwnTheGroup';
import { UserAlreadyJoinedException } from '../../session/exception/userAlreadyJoined.exception';
import { StudentNotInGroupException } from '../exception/studentNotInGroup.exception';

@Controller('group')
export class GroupController {
  constructor(
    private readonly userService: UserService,
    private readonly teacherMapper: TeacherMapper,
  ) {}
  @Roles([UserType.TEACHER])
  @Post('/create') //TODO to test
  async createGroup(@Req() request: UserRequest, @Body('name') name: string) {
    return this.userService.createGroup(name, <Teacher>request.user);
  }
  @Roles([UserType.TEACHER])
  @Delete('/:id') //TODO to test
  async deleteGroup(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idGroup: number,
  ) {
    if (
      await this.userService.isGroupFromTeacher(
        idGroup,
        request.user as Teacher,
      )
    ) {
      throw new DontOwnTheGroup();
    }
    return this.userService.deleteGroup(idGroup, request.user as Teacher);
  }

  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Get('/:id') //TODO to test
  async getGroup(@Param('id', ParseIntPipe) idGroup: number) {
    return this.userService.getGroup(idGroup);
  }
  @Roles([UserType.TEACHER])
  @Post('/:id/user/:idUser') //TODO to test
  async addUserToGroup(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idGroup: number,
    @Param('idUser', ParseIntPipe) idUser: number,
  ) {
    if (
      await this.userService.isGroupFromTeacher(
        idGroup,
        request.user as Teacher,
      )
    ) {
      throw new DontOwnTheGroup();
    } else if (await this.userService.isAlreadyInGroup(idGroup, idUser)) {
      throw new UserAlreadyJoinedException();
    }
    return this.userService.addUserToGroup(idGroup, idUser);
  }

  @Roles([UserType.TEACHER])
  @Delete('/:id/user/:idUser') //TODO to test
  async removeStudentFromGroup(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idGroup: number,
    @Param('idUser', ParseIntPipe) idUser: number,
  ) {
    if (
      await this.userService.isGroupFromTeacher(
        idGroup,
        request.user as Teacher,
      )
    ) {
      throw new DontOwnTheGroup();
    } else if (!(await this.userService.isAlreadyInGroup(idGroup, idUser))) {
      throw new StudentNotInGroupException();
    }
    return this.userService.removeStudentFromGroup(idGroup, idUser);
  }

  @Get('/:id/user') //TODO to test weirder than before
  async getUser(@Param('id', ParseIntPipe) idGroup: number) {
    return this.userService.getUserWithGroup(idGroup);
  }

  @Roles([UserType.TEACHER])
  @Get('/user') //TODO to test
  async getGroupsFromTeacher(@Req() request: UserRequest) {
    return this.userService.getGroupsFromTeacher(request.user as Teacher);
  }
}
