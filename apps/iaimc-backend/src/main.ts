import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import cookieParser = require('cookie-parser');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  setupCors(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

const setupCors: (app: INestApplication) => void = (app: INestApplication) => {
  const allowedOrigins = [
    'https://injection-moulding-configurator.vercel.app',
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${process.env.CLIENT_PORT}`
      : '',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};

bootstrap();
