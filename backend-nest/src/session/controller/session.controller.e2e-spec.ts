import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })/*
      .overrideModule(ConfigModule)
      .useModule(
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.local'],
        }),
      )
      .overrideModule(TypeOrmModule)
      .useModule(
        TypeOrmModule.forRootAsync({
          useFactory: getTypeOrmConfig,
          inject: [ConfigService],
        }),
      )*/
      .compile();

    app = module.createNestApplication({ cors: true });
    await app.init();
  });

  it('question', async () => {
    await request('http://localhost:3000') // Remplacez 3000 par le port de votre serveur
      .get('/question')
      .expect(200); // Assurez-vous que c'est le bon code d'état attendu pour cette requête
  });

  /*it('question', async () => {
    console.log(request(app.getHttpServer()).get('/question'));
    return await request(app.getHttpServer()).get('/question').expect(201);
  });*/
});
