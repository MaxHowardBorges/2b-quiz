import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return await this.authService.signIn(loginDto.username, loginDto.password);
  }
}
