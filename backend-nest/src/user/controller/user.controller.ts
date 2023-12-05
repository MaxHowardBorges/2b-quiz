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
import { Public } from '../../decorators/public.decorator';
import { UserDataModifyDto } from '../dto/userDataModify.dto';
import { UserRequest } from '../../auth/config/user.request';
import { UserSelfDeleteDto } from '../dto/userSelfDelete.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../constants/userType.constant';
import { UserFullDataDto } from '../dto/userFullData.dto';
import { UserMapper } from '../mapper/user.mapper';
import { UserTypeDto } from '../dto/userType.dto';
import { UserSelfValidateDto } from '../dto/userSelfValidate.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Public() //TODO to pass for admin only
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
    );
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
  ): Promise<UserFullDataDto[]> {
    const userList = await this.userService.getUsersPerPage(page, nbItem);
    return this.userMapper.userFullDataDtoListMap(userList);
  }

  @Get('/role')
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
