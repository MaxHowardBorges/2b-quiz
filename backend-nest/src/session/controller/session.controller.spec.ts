import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { QuestionService } from '../../question/service/question.service';
import { QuestionModule } from '../../question/question.module';
import { EventService } from '../../event/service/event.service';

describe('SessionController', () => {
  let sessionController: SessionController;
  let sessionService: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [SessionService, SessionMapper, QuestionService, EventService],
      imports: [QuestionModule],
    }).compile();

    sessionController = module.get<SessionController>(SessionController);
    sessionService = module.get<SessionService>(SessionService);
  });
});
