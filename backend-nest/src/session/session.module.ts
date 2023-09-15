import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { QuestionModule } from '../question/question.module';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [QuestionModule],
})
export class SessionModule {}
