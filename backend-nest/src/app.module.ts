import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuestionModule } from './question/question.module';
import { SessionModule } from './session/session.module';
import { SessionService } from './session/service/session.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    QuestionModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionService],
})
export class AppModule {}
