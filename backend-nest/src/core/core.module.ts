import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NoContentInterceptor } from './interceptor/noContent.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: NoContentInterceptor,
    },
  ],
})
export class CoreModule {}
