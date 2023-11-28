import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication({ cors: true });
    await app.init();
  });

  describe('Questionnary (e2e)', () => {
    it('createSession with questionnary', async () => {
      let questionnary = await request('http://localhost:3000/questionnary')
        .post('/create')
        .send({
          title: 'testQuestionnary',
          author: 'AuthorTest',
          questions: [{ content: 'aa', answers: [] }],
        });

      expect(questionnary.status).toBe(201);

      let session = await request('http://localhost:3000/session')
        .post('/create')
        .send(questionnary.body);
      expect(session.status).toBe(201);
      expect(session.noContent).toBeFalsy();
      expect(typeof session.body.id).toBe('string');
    });
  });
});
