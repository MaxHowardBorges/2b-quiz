import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuestionModule } from './question/question.module';
import { SessionModule } from './session/session.module';
import { EventModule } from './event/event.module';
import { QuestionnaryModule } from './questionnary/questionnary.module';
import { Question } from './question/entity/question.entity';

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
    EventModule,
    QuestionnaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
