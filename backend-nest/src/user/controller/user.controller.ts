import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { UsernameAlreadyUsedException } from '../exception/usernameAlreadyUsed.exception';
import { UserDataModifyDto } from '../dto/userDataModify.dto';
import { UserRequest } from '../../auth/config/user.request';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../constants/userType.constant';
import { UserMapper } from '../mapper/user.mapper';
import { UserTypeDto } from '../dto/userType.dto';
import { UserSelfValidateDto } from '../dto/userSelfValidate.dto';
import { UserListDto } from '../dto/userList.dto';
import { SortParamUserDto } from '../dto/sortParamUser.dto';
import { User } from '../entity/user.entity';
import { UserRegisterArrayDto } from '../dto/userRegisterArray.dto';
import { UsernamesAlreadyUsedException } from '../exception/usernamesAlreadyUsed.exception';
import { UsernamesDuplicatedUsedException } from '../exception/usernamesDuplicatedUsed.exception';
import { UserDataRestoreDto } from '../dto/userDataRestore.dto';
import { Teacher } from '../entity/teacher.entity';
import { CreateGroupDto } from '../dto/createGroup.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get('/me')
  async getMe(@Req() request: UserRequest) {
    return this.userMapper.userSelfDataDtoMap(request.user);
  }

  @Roles([UserType.ADMIN])
  @Post('/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(
    @Body(new ValidationPipe()) userRegisterDto: UserRegisterDto,
  ) {
    if (!(await this.userService.usernameNotUsed(userRegisterDto.username)))
      throw new UsernameAlreadyUsedException();

    await this.userService.createUser(
      userRegisterDto.username,
      userRegisterDto.name,
      userRegisterDto.surname,
      userRegisterDto.userType,
      true,
    );
  }

  @Roles([UserType.ADMIN])
  @Post('/register/multiple')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerMultipleUser(
    @Body(new ValidationPipe()) userRegisterArrayDto: UserRegisterArrayDto,
  ) {
    const usedUsernames = [];
    for (const userRegisterDto of userRegisterArrayDto.users) {
      if (!(await this.userService.usernameNotUsed(userRegisterDto.username)))
        usedUsernames.push(userRegisterDto.username);
    }
    if (usedUsernames.length > 0)
      throw new UsernamesAlreadyUsedException(usedUsernames);

    //check if there is duplicate usernames
    const duplicateUsernames = [];
    for (let i = 0; i < userRegisterArrayDto.users.length; i++) {
      for (let j = i + 1; j < userRegisterArrayDto.users.length; j++) {
        if (
          userRegisterArrayDto.users[i].username ===
          userRegisterArrayDto.users[j].username
        )
          duplicateUsernames.push(userRegisterArrayDto.users[i].username);
      }
    }
    if (duplicateUsernames.length > 0)
      throw new UsernamesDuplicatedUsedException(usedUsernames);

    for (const userRegisterDto of userRegisterArrayDto.users) {
      await this.userService.createUser(
        userRegisterDto.username,
        userRegisterDto.name,
        userRegisterDto.surname,
        userRegisterDto.userType,
        true,
      );
    }
  }

  @Patch('/modify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async modifyUserData(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) userDataDto: UserDataModifyDto,
  ) {
    await this.userService.updateUser(
      request.user,
      userDataDto.name,
      userDataDto.surname,
    );
  }

  @Roles([UserType.ADMIN])
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) idUser: number) {
    if (await this.userService.isUserValidated(idUser))
      await this.userService.deleteSoftUser(idUser);
    else await this.userService.deleteUser(idUser);
  }

  @Roles([UserType.ADMIN])
  @Patch('/:id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreUser(
    @Param('id', ParseIntPipe) idUser: number,
    @Body(new ValidationPipe()) userDataDto: UserDataRestoreDto,
  ) {
    await this.userService.restoreUser(
      idUser,
      userDataDto.name,
      userDataDto.surname,
    );
  }

  @Roles([UserType.ADMIN])
  @Patch('/:id/validate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async validateUser(@Param('id', ParseIntPipe) idUser: number) {
    await this.userService.validateUser(idUser);
  }

  @Roles([UserType.ADMIN])
  @Get('')
  async getUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('nb-item', new ParseIntPipe({ optional: true })) nbItem: number = 50,
    @Query('sort', new ValidationPipe({ transform: true }))
    sort: SortParamUserDto,
    @Query('deleted', new ValidationPipe({ transform: true }))
    deleted: boolean = false,
  ): Promise<UserListDto> {
    let userList: User[];
    if (!!sort.field && !!sort.order)
      userList = await this.userService.getUsersPerPageSorted(
        page,
        nbItem,
        sort.field,
        sort.order,
        deleted,
      );
    else
      userList = await this.userService.getUsersPerPage(page, nbItem, deleted);
    const nbPage = await this.userService.getNbUsersPage(nbItem);
    if (deleted) return this.userMapper.userDeleteDtoListMap(userList, nbPage);
    return this.userMapper.userFullDataDtoListMap(userList, nbPage);
  }

  @Get('/role')
  @Roles([
    UserType.NOT_CHOOSE,
    UserType.ADMIN,
    UserType.STUDENT,
    UserType.TEACHER,
  ])
  async getRole(@Req() request: UserRequest): Promise<UserTypeDto> {
    return { userType: request.user.getUserType() };
  }

  @Post('/validate')
  @Roles([UserType.NOT_CHOOSE])
  @HttpCode(HttpStatus.NO_CONTENT)
  async selfValidateUser(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) userSelfValidateDto: UserSelfValidateDto,
  ) {
    await this.userService.selfValidate(
      request.user,
      userSelfValidateDto.name,
      userSelfValidateDto.surname,
      userSelfValidateDto.userType,
    );
  }

  @Post('/ask-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async askDeleteUser(@Req() request: UserRequest) {
    await this.userService.askDeleteUser(request.user);
  }

  @Patch('/:id/reject-ask-delete')
  @Roles([UserType.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectAskDeleteUser(@Param('id', ParseIntPipe) idUser: number) {
    await this.userService.rejectAskDeleteUser(idUser);
  }
  @Roles([UserType.TEACHER])
  @Post('/createGroup')
  async createGroup(@Body() dto: CreateGroupDto) {
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
  @Put('/:id/addStudentToGroup')
  async addStudentToGroup(
    @Param('id', ParseIntPipe) idGroup: number,
    @Body(new ValidationPipe()) idStudent: number,
  ) {
    //return this.userService.addStudentToGroup(idGroup, idStudent);
  }
  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Patch('/:id/removeStudentFromGroup')
  async removeStudentFromGroup(
    @Param('id', ParseIntPipe) idGroup: number,
    @Body(new ValidationPipe()) idStudent: number,
  ) {
    return this.userService.removeStudentFromGroup(idGroup, idStudent);
  }
  @Roles([UserType.TEACHER])
  @Put('/:id/addTeacherToGroup')
  async addTeacherToGroup() {}
}
