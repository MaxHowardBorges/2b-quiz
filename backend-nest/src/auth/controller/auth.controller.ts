import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../../decorators/public.decorator';
import { BlacklistService } from '../service/blacklist.service';
import { Request } from 'express';
import { UserRequest } from '../config/user.request';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacklistService: BlacklistService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('/login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return await this.authService.signIn(loginDto.ticket, loginDto.service);
  }

  @Public()
  @Post('/dev/login')
  async loginDev(@Body(new ValidationPipe()) dto: { username: string }) {
    if (this.configService.getOrThrow('APP_ENV') !== 'dev')
      throw new ForbiddenException();
    return await this.authService.signInDev(dto.username);
  }

  @Post('/renew')
  async renewToken(@Req() request: UserRequest) {
    return await this.authService.renewToken(request.user);
  }

  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request) {
    const token = request.headers.authorization?.split(' ')[1];
    this.blacklistService.addToBlacklist(token);
  }
}
