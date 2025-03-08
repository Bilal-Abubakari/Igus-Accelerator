import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

type CorsOriginsFn = (error: Error | null, allow: boolean) => void;

const logger = new Logger();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  setupCors(app);

  const port = process.env.PORT || 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(port);
}

const setupCors: (app: INestApplication) => void = (app: INestApplication) => {
  const previewUrlPattern =
    /^https:\/\/preview-injection-moulding-configurator-[a-z0-9]+\.vercel\.app$/;

  const allowedOrigins = [
    'https://injection-moulding-configurator.vercel.app',
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${process.env.CLIENT_PORT}`
      : '',
  ];

  const corsOriginsFn: (
    origin: string | undefined,
    cb: CorsOriginsFn,
  ) => void = (origin: string | undefined, cb: CorsOriginsFn) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      previewUrlPattern.test(origin)
    ) {
      cb(null, true);
    } else {
      logger.warn('Access denied for origin:', origin);
      cb(null, false);
    }
  };

  app.enableCors({
    origin: corsOriginsFn,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};

bootstrap();
