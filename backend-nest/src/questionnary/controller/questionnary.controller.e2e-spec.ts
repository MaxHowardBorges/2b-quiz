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
    it('createQuestionnary', async () => {
      let questionnary = await request('http://localhost:3000/questionnary')
        .post('/create')
        .send({
          title: 'testQuestionnary',
          author: 'AuthorTest',
          questions: [{ content: 'aa', answers: [] }],
        });

      expect(questionnary.status).toBe(201);

      await request('http://localhost:3000/questionnary')
        .post('/' + questionnary.body.id + '/add-question')
        .send({
          content: 'ab',
          answers: [
            { content: 'ba', isCorrect: true },
            { content: 'ea', isCorrect: false },
          ],
        })
        .expect(201);
    });
  });
});
