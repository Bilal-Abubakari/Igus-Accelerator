import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './configurations/database.config';
import envConfig from './configurations/env.config';
import jwtConfig from './configurations/jwt.config';
import throttlerConfig from './configurations/throttler.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { ContactFormModule } from './modules/contact-form/contact-form.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { ModelConfigModule } from './modules/model-configurations/model-config.module';

@Module({
  imports: [
    FileUploadModule,
    FeedbackModule,
    ContactFormModule,
    MaterialsModule,
    AuthModule,
    ModelConfigModule,
    CacheModule.register(),
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRoot(databaseConfig().database),
    JwtModule.register(jwtConfig().jwtOptions),
    ThrottlerModule.forRoot(throttlerConfig().throttlerOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
