import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './configurations/database.config';
import envConfig from './configurations/env.config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRoot(databaseConfig().database),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
