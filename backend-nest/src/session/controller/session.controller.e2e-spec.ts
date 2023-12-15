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

  describe('Session (e2e)', () => {
    it('createSession', async () => {
      let questionnary = await request('http://localhost:3000/questionnary')
        .post('/create')
        .send({
          title: 'testQuestionnary',
          author: 'AuthorTest',
          questions: [{ content: 'aa', answers: [] }],
        });
      let session = await request('http://localhost:3000/session')
        .post('/create')
        .send(questionnary.body);
      expect(session.status).toBe(201);
      expect(session.noContent).toBeFalsy();

      expect(typeof session.body.id).toBe('string');
    });
    it('nextQuestion', async () => {
      let questionnary = await request('http://localhost:3000/questionnary')
        .post('/create')
        .send({
          title: 'testQuestionnary',
          author: 'AuthorTest',
          questions: [
            {
              content: 'aa',
              answers: [
                { content: 'bb', isCorrect: true },
                { content: 'bb', isCorrect: false },
              ],
            },
          ],
        })
        .expect(201);
      let questionanryDto = await request('http://localhost:3000/questionnary')
        .get('/' + questionnary.body.id + '/select')
        .expect(200);
      let session = await request('http://localhost:3000/session')
        .post('/create')
        .send([questionanryDto.body])
        .expect(201);
      let nextQ = await request('http://localhost:3000/session')
        .post('/nextQuestion')
        .send({ idSession: session.body.id })
        .expect(201);

      console.log(questionnary.body.questions);
      expect(nextQ.status).toBe(201);
      expect(nextQ.noContent).toBeFalsy();
      expect(nextQ.body.answers.length).toBeGreaterThanOrEqual(2);
      expect(nextQ.body.id).not.toBeNull();
      expect(typeof nextQ.body.content).toBe('string');
    });
    it('getCurrentQuestion', async () => {
      let questionnary = await request('http://localhost:3000/questionnary')
        .post('/create')
        .send({
          title: 'testQuestionnary',
          author: 'AuthorTest',
          questions: [
            {
              content: 'aa',
              answers: [
                { content: 'bb', isCorrect: true },
                { content: 'bb', isCorrect: false },
              ],
            },
          ],
        })
        .expect(201);
      let questionanryDto = await request('http://localhost:3000/questionnary')
        .get('/' + questionnary.body.id + '/select')
        .expect(200);
      //console.log(questionnary.body);
      let session = await request('http://localhost:3000/session')
        .post('/create')
        .send([questionanryDto.body])
        .expect(201);
      let currentQ = await request('http://localhost:3000/session')
        .post('/question/current')
        .send({ idSession: session.body.id });

      expect(currentQ.status).toBe(500);
      expect(currentQ.noContent).toBeFalsy();
      await request('http://localhost:3000/session')
        .post('/nextQuestion')
        .send({ idSession: session.body.id });

      currentQ = await request('http://localhost:3000/session')
        .post('/question/current')
        .send({ idSession: session.body.id });

      expect(currentQ.status).toBe(201);
      expect(currentQ.body.answers.length).toBeGreaterThanOrEqual(2);
      expect(currentQ.body.id).not.toBeNull();
      expect(typeof currentQ.body.content).toBe('string');
      console.log(questionanryDto.body.answers);
    });

    it('join', async () => {
      let session = await request('http://localhost:3000/session').post(
        '/create',
      );

      let user = await request('http://localhost:3000/session')
        .post('/join')
        .send({ idSession: session.body.id, username: 'UserTest' });

      expect(user.status).toBe(204);
      expect(user.body.username).toBeUndefined();
    });

    //TODO NOT WORKING
    /*it('respond', async () => {
      let questionnary = await request('http://localhost:3000/questionnary')
        .post('/create')
        .send({
          title: 'testQuestionnary',
          author: 'AuthorTest',
          questions: [
            {
              content: 'aa',
              answers: [
                { content: 'bb', isCorrect: true },
                { content: 'bb', isCorrect: false },
              ],
            },
          ],
        })
        .expect(201);
      let questionnaryDto = await request('http://localhost:3000/questionnary')
        .get('/' + questionnary.body.id + '/select')
        .expect(200);

      let session = await request('http://localhost:3000/session')
        .post('/create')
        .send([questionnaryDto.body])
        .expect(201);

      await request('http://localhost:3000/session')
        .post('/join')
        .send({ idSession: session.body.id, username: 'UserTest' })
        .expect(204);

      await request('http://localhost:3000/session')
        .post('/nextQuestion')
        .send({ id: session.body.id })
        .expect(201);

      await request('http://localhost:3000/session')
        .post('/question/current')
        .send({ idSession: session.body.id })
        .expect(201);

      console.log(questionnaryDto.body.questions[0].answers[0].id);
      let response = await request('http://localhost:3000/session')
        .post('/respond')
        .send({
          idSession: session.body.id,
          answer: questionnaryDto.body.questions[0].answers[0].id,
          username: session.body.connectedUser.username, //,'UserTest',
        });
      console.log(session.body.connectedUser);
      console.log(response.body);
      expect(response.status).toBe(204);
    });*/
  });
});
