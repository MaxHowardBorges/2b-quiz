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
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserMapper } from '../mapper/user.mapper';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../constants/userType.constant';
import { CreateGroupDto } from '../dto/createGroup.dto';
import { AddStudentToGroupDto } from '../dto/addStudentToGroup.dto';
import { RemoveStudentFromGroupDto } from '../dto/removeStudentFromGroup.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly userService: UserService) {}
  @Roles([UserType.TEACHER])
  @Post('/createGroup')
  async createGroup(@Body(new ValidationPipe()) dto: CreateGroupDto) {
    return this.userService.createGroup(dto);
  }
  @Roles([UserType.TEACHER])
  @Delete('/:id/deleteGroup')
  async deleteGroup(@Param('id', ParseIntPipe) idGroup: number) {
    return this.userService.deleteGroup(idGroup);
  }

  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Get('/:id/getGroup')
  async getGroup(@Param('id', ParseIntPipe) idGroup: number) {
    return this.userService.getGroup(idGroup);
  }
  @Roles([UserType.TEACHER])
  @Put('/:id/addUserToGroup')
  async addUserToGroup(
    @Param('id', ParseIntPipe) idGroup: number,
    @Body(new ValidationPipe()) dto: AddStudentToGroupDto,
  ) {
    return this.userService.addUserToGroup(idGroup, dto.idStudent);
  }
  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Patch('/:id/removeStudentFromGroup')
  async removeStudentFromGroup(
    @Param('id', ParseIntPipe) idGroup: number,
    @Body(new ValidationPipe()) dto: RemoveStudentFromGroupDto,
  ) {
    return this.userService.removeStudentFromGroup(idGroup, dto.idStudent);
  }

  @Get('/:id/getUser')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserWithGroup(id);
  }

  @Get('/:id/getGroupFromTeacher')
  async getGroupFromTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getGroupFromTeacher(id);
  }
}
