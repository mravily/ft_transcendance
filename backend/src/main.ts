import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ValidationException, ValidationFilter } from './validation.filter';

import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
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
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: false,
    exceptionFactory: (errors: ValidationError[]) => {
      const errMsg = {};
      errors.forEach(err => {
        errMsg[err.property] = [...Object.values(err.constraints)];
      });
      return new ValidationException(errMsg);
    }
  }));
  app.useStaticAssets(join(__dirname, 'upload'), {
    index: false,
    prefix: '/upload',
  });

  await app.listen(3000);
}
bootstrap();
