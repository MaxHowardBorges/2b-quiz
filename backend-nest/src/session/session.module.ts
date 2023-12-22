import { Module } from '@nestjs/common';
import { SessionController } from './controller/session.controller';
import { SessionService } from './service/session.service';
import { QuestionModule } from '../question/question.module';
import { QuestionnaryModule } from '../questionnary/questionnary.module';
import { QuestionService } from '../question/service/question.service';
import { QuestionnaryService } from '../questionnary/service/questionnary.service';
import { SessionMapper } from './mapper/session.mapper';
import { EventModule } from '../event/event.module';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionMapper, QuestionnaryService, QuestionService],
  imports: [QuestionnaryModule, QuestionModule, EventModule],
})
export class SessionModule {}
