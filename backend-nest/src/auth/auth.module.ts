import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtModuleOptions } from './config/jwt.config';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { AuthGuard } from './guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { BlacklistService } from './service/blacklist.service';

@Module({
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    BlacklistService,
  ],
  controllers: [AuthController],
  imports: [
    BcryptModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: getJwtModuleOptions,
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
