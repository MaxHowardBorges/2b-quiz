import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtModuleOptions } from './config/jwt.config';
import { AuthGuard } from './guard/auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { BlacklistService } from './service/blacklist.service';
import { CasModule } from '../cas/cas.module';
import { UpdateTokenInterceptor } from './interceptor/updateToken.interceptor';

@Module({
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UpdateTokenInterceptor,
    },
    BlacklistService,
  ],
  controllers: [AuthController],
  imports: [
    CasModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: getJwtModuleOptions,
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
