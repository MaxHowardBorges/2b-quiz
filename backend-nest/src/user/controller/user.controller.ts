import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { UsernameAlreadyUsedException } from '../exception/usernameAlreadyUsed.exception';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
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
}
