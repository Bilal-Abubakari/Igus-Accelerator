import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  setupCors(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

const setupCors: (app: INestApplication) => void = (app: INestApplication) => {
  const allowedOrigins = ['https://injection-moulding-configurator.vercel.app'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};

bootstrap();
