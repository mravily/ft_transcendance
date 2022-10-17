import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create(AppModule, {logger: false,});
  
  app.setGlobalPrefix('api');
  app.use(
    session({
      name: 'session_id',
      resave: false,
      saveUninitialized: false,
      secret: '!Paris',
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, 'upload'), {
    index: false,
    prefix: '/upload',
  });

  await app.listen(3000);
}
bootstrap();
