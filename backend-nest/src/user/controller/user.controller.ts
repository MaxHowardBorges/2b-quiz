import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { UsernameAlreadyUsedException } from '../exception/usernameAlreadyUsed.exception';
import { Public } from '../../decorators/public.decorator';
import { UserDataModifyDto } from '../dto/userDataModify.dto';
import { UserRequest } from '../../auth/config/user.request';
import { UserPasswordModifyDto } from '../dto/userPasswordModify.dto';
import { UserUsernameModifyDto } from '../dto/userUsernameModify.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
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
      userRegisterDto.password,
      userRegisterDto.userType,
    );
  }

  @Patch('/modify')
  async modifyUserData(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) userDataDto: UserDataModifyDto,
  ) {
    await this.userService.updateUser(
      request.user,
      userDataDto.name,
      userDataDto.surname,
      userDataDto.password,
    );
  }

  @Patch('/modify/password')
  async modifyUserPassword(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) userPasswordModifyDto: UserPasswordModifyDto,
  ) {
    await this.userService.updateUserPassword(
      request.user,
      userPasswordModifyDto.oldPassword,
      userPasswordModifyDto.newPassword,
    );
  }

  @Patch('/modify/username')
  async modifyUserUsername(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) userUsernameModifyDto: UserUsernameModifyDto,
  ) {
    await this.userService.updateUserUsername(
      request.user,
      userUsernameModifyDto.username,
      userUsernameModifyDto.password,
    );
  }
}
