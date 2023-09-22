import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // autorisation d'appel de l'API par le front-end
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
