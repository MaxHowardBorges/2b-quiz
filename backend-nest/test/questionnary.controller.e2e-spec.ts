import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testTypeOrmConfig } from './testDatabase.config';
import * as request from 'supertest';
import { createTestDatabase, dropTestDatabase } from './setupTest';

describe('QuestionnaryController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let testTypeOrmConfigOptions = testTypeOrmConfig;

  beforeAll(async () => {
    await createTestDatabase(testTypeOrmConfigOptions);
  }, 60000);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testTypeOrmConfigOptions), AppModule],
    }).compile();

    app = module.createNestApplication({});
    await app.init();
    //wait for migration to finish
    await new Promise((resolve) => setTimeout(resolve, 20000));

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/dev/login')
      .send({
        username: 'Noel.Breton1',
      })
      .expect(201);

    token = loginResponse.body.access_token;
  }, 60000);

  describe('Questionnary (e2e)', () => {
    it('createQuestionnary', async () => {
      let questionnary = await request(app.getHttpServer())
        .post('/questionnary/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'testQuestionnary',
          questions: [],
        })
        .expect(201);
    });
    it('modifyQuestionnary', async () => {
      let questionnary = await request(app.getHttpServer())
        .post('/questionnary/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'testQuestionnary',
          questions: [],
        })
        .expect(201);

      questionnary = await request(app.getHttpServer())
        .patch(`/questionnary/${questionnary.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'testQuestionnary2',
          questions: [],
        })
        .expect(200);
    });
    it('deleteQuestionnary', async () => {
      let questionnary = await request(app.getHttpServer())
        .post('/questionnary/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'testQuestionnary',
          questions: [],
        })
        .expect(201);

      questionnary = await request(app.getHttpServer())
        .delete(`/questionnary/${questionnary.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
  it('selectQuestionnary', async () => {
    let questionnary = await request(app.getHttpServer())
      .post('/questionnary/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'testQuestionnary',
        questions: [],
      })
      .expect(201);

    questionnary = await request(app.getHttpServer())
      .get(`/questionnary/${questionnary.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
    await dropTestDatabase(testTypeOrmConfigOptions);
  });
});
