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
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { UsernameAlreadyUsedException } from '../exception/usernameAlreadyUsed.exception';
import { UserDataModifyDto } from '../dto/userDataModify.dto';
import { UserRequest } from '../../auth/config/user.request';
import { UserSelfDeleteDto } from '../dto/userSelfDelete.dto';
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

  @Patch('/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSelfUser(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) userSelfDeleteDto: UserSelfDeleteDto,
  ) {
    await this.userService.deleteSelfUser(
      request.user,
      userSelfDeleteDto.username,
    );
  }

  @Roles([UserType.ADMIN])
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) idUser: number) {
    await this.userService.deleteUser(idUser);
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
  ): Promise<UserListDto> {
    let userList: User[];
    if (!!sort.field && !!sort.order)
      userList = await this.userService.getUsersPerPageSorted(
        page,
        nbItem,
        sort.field,
        sort.order,
      );
    else userList = await this.userService.getUsersPerPage(page, nbItem);
    const nbPage = await this.userService.getNbUsersPage(nbItem);
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
}
