import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path'; // Import path module
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useStaticAssets(path.join(__dirname, '../public'));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cookieParser());
  await app.listen(5026);
}
bootstrap();
