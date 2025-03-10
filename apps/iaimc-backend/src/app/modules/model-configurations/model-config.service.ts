import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { UserEntity } from '../../common/entities/user.entity';
import { FileStoreDirectory, MulterFile } from '../../common/types/file.types';
import { JwtUserPayload, ReviewStatus } from '../../common/types/general.types';
import { MaterialName } from '../../common/types/material.types';
import { getFileExtension } from '../../common/utils/file.utils';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CloudinayFileUploadResult } from '../file-upload/types/file-upload.type';
import { ModelConfigurationEntity } from './entities/configuration.entity';
import { FileEntity } from './entities/file.entity';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '../../common/constants';

export const DEFAULT_MATERIAL: MaterialName = 'A160';
export const CONFIGURATION_CACHE_EXPIRATION_TIME_MS =
  1000 * ACCESS_TOKEN_EXPIRATION_TIME;

@Injectable()
export class ModelConfigService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ModelConfigurationEntity)
    private readonly modelConfigRepo: Repository<ModelConfigurationEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  public async uploadConfig(
    { id, anonymous }: JwtUserPayload,
    file: MulterFile,
  ): Promise<ModelConfigurationEntity> {
    const { data } = await this.fileUploadService.uploadFile(
      file,
      FileStoreDirectory.MODELS,
    );
    if (!data)
      throw new InternalServerErrorException('Could not upload configuration');

    return anonymous
      ? this.updateAnonymousUserConfigs(id, data)
      : this.updateUserConfigs(id, data);
  }

  public createNewConfig(
    data: CloudinayFileUploadResult,
    generateIds: boolean,
  ): ModelConfigurationEntity {
    const {
      display_name: name,
      secure_url: url,
      etag: checksum,
      asset_folder: assetFolder,
      created_at: uploadDate,
    } = data;
    const type = getFileExtension(name);

    const file = this.fileRepo.create({
      id: generateIds ? uuidV4() : undefined,
      name,
      type,
      url,
      checksum,
      assetFolder,
      uploadDate,
    });

    const modelConfig = this.modelConfigRepo.create({
      id: generateIds ? uuidV4() : undefined,
      material: DEFAULT_MATERIAL,
      quantity: 1,
      lifeTime: null,
      reviewStatus: ReviewStatus.Unsubmitted,
      file,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return modelConfig;
  }

  public async updateUserConfigs(
    userId: string,
    data: CloudinayFileUploadResult,
  ): Promise<ModelConfigurationEntity> {
    let modelConfig = this.createNewConfig(data, false);
    const file = await this.fileRepo.save(modelConfig.file);
    modelConfig = await this.modelConfigRepo.save({
      ...modelConfig,
      file,
    });

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { modelConfigurations: true },
    });

    if (!user) throw new BadRequestException('User not found');

    user.modelConfigurations.push(modelConfig);
    await this.userRepo.save(user);

    return modelConfig;
  }

  public async updateAnonymousUserConfigs(
    userId: string,
    data: CloudinayFileUploadResult,
  ): Promise<ModelConfigurationEntity> {
    let newConfig = this.createNewConfig(data, true);

    let configs = (await this.cacheManager.get(userId)) as
      | ModelConfigurationEntity[]
      | undefined;

    if (configs) {
      const duplicateConfig = this.findDuplicateConfig(configs, newConfig);
      if (!duplicateConfig) {
        configs.push(newConfig);
      } else {
        newConfig = duplicateConfig;
      }
    } else {
      configs = [newConfig];
    }

    await this.cacheManager.set(
      userId,
      configs,
      CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
    );

    return newConfig;
  }

  public async setConfigSnapshot(
    { id, anonymous }: JwtUserPayload,
    configId: string,
    snapshot: string,
  ): Promise<void> {
    if (anonymous) {
      await this.setAnonymousUserConfigSnapshot(id, configId, snapshot);
    } else {
      await this.setUserConfigSnapshot(id, configId, snapshot);
    }
  }

  public async setAnonymousUserConfigSnapshot(
    userId: string,
    configId: string,
    snapshot: string,
  ): Promise<void> {
    let configs = (await this.cacheManager.get(userId)) as
      | ModelConfigurationEntity[]
      | undefined;

    if (!configs) {
      throw new InternalServerErrorException(
        'Could not set snapshot for the configuration',
      );
    }

    configs = configs.map((config) => {
      if (config.id === configId) {
        return {
          ...config,
          snapshot,
        };
      }

      return config;
    });

    await this.cacheManager.set(
      userId,
      configs,
      CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
    );
  }

  public async setUserConfigSnapshot(
    userId: string,
    configId: string,
    snapshot: string,
  ): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { modelConfigurations: true },
    });

    if (!user) throw new BadRequestException('User not found');

    const configs = user.modelConfigurations.map((config) => {
      if (config.id === configId) {
        return {
          ...config,
          snapshot,
        };
      }

      return config;
    });
    user.modelConfigurations = configs;

    await this.userRepo.save(user);
  }

  public findDuplicateConfig(
    configs: ModelConfigurationEntity[],
    newConfig: ModelConfigurationEntity,
  ): ModelConfigurationEntity | undefined {
    return configs.find(
      (config) =>
        config.file.name === newConfig.file.name &&
        config.file.checksum === newConfig.file.checksum,
    );
  }
}
