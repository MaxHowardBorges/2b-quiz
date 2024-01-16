import { Module } from '@nestjs/common';
import { SessionController } from './controller/session.controller';
import { SessionService } from './service/session.service';
import { QuestionModule } from '../question/question.module';
import { QuestionnaryModule } from '../questionnary/questionnary.module';
import { SessionMapper } from './mapper/session.mapper';
import { EventModule } from '../event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnary } from '../questionnary/entity/questionnary.entity';
import { Session } from './entity/session.entity';
import { UserSession } from './entity/userSession.entity';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionMapper],
  imports: [
    QuestionnaryModule,
    QuestionModule,
    EventModule,
    TypeOrmModule.forFeature([Session, UserSession]),
  ],
})
export class SessionModule {}
