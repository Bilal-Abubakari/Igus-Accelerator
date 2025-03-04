import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './configurations/database.config';
import envConfig from './configurations/env.config';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { FeedbackModule } from './modules/feedback/feedback.module';

@Module({
  imports: [
    FileUploadModule,
    FeedbackModule,
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRoot(databaseConfig().database),
    ContactFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
