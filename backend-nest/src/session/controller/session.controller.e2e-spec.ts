import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import { SessionController } from './session.controller';
import { SessionService } from '../service/session.service';
import { QuestionService } from '../../question/service/question.service';
import { SessionMapper } from '../mapper/session.mapper';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';
import { Session } from '../session';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      /*controllers: [SessionController],
      providers: [
        SessionService,
        QuestionService,
        AnswerMapper, // Incluez l'AnswerMapper ici
        EventService,
      ],*/
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/create', () => {
    return request(app.getHttpServer()).post('/session/create').expect(201);
  });
});
