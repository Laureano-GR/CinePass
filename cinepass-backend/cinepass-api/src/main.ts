import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads', 'banners'), {
    prefix: '/banners', // Esto hará que las banners sean accesibles en http://localhost:3001/banners/
  });

  await app.listen(3001);
}
bootstrap();
