import { Module } from '@nestjs/common';
import { SessionController } from './controller/session.controller';
import { SessionService } from './service/session.service';
import { QuestionModule } from '../question/question.module';
import { SessionMapper } from './mapper/session.mapper';
import { EventModule } from '../event/event.module';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionMapper],
  imports: [QuestionModule, EventModule],
})
export class SessionModule {}
