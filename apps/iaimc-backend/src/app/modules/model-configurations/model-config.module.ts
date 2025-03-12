import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, FileEntity, ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ModelConfigController } from './model-config.controller';
import { ModelConfigService } from './model-config.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([
      UserEntity,
      ModelConfigurationEntity,
      FileEntity,
    ]),
  ],
  controllers: [ModelConfigController],
  providers: [ModelConfigService, FileUploadService],
})
export class ModelConfigModule { }
