import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../common/entities/user.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ModelConfigurationEntity } from './entities/configuration.entity';
import { FileEntity } from './entities/file.entity';
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
export class ModelConfigModule {}
