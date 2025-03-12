import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { UploadApiResponse } from 'cloudinary';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ACCESS_TOKEN_EXPIRATION_TIME } from '../../common/constants';
import { FileStoreDirectory, MulterFile } from '../../common/types/file.types';
import { JwtUserPayload } from '../../common/types/general.types';
import { getFileExtension } from '../../common/utils/file.utils';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileEntity, ModelConfigurationEntity, MaterialName, UserEntity, ReviewStatus, ConfigCount } from '@igus-accelerator-injection-molding-configurator/libs/shared';

export const DEFAULT_MATERIAL: MaterialName = 'A160';
export const CONFIGURATION_CACHE_EXPIRATION_TIME_MS = 10000 * ACCESS_TOKEN_EXPIRATION_TIME;

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
  ) { }

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

  public createNewConfig(data: UploadApiResponse): ModelConfigurationEntity {
    const {
      display_name: name,
      secure_url: url,
      etag: checksum,
      asset_folder: assetFolder,
      created_at: uploadDate,
    } = data;
    const type = getFileExtension(name);

    const file = this.fileRepo.create({
      id: uuidV4(),
      name,
      type,
      url,
      checksum,
      assetFolder,
      uploadDate,
    });

    const modelConfig = this.modelConfigRepo.create({
      id: uuidV4(),
      material: DEFAULT_MATERIAL,
      quantity: 1,
      lifeTime: null,
      reviewStatus: ReviewStatus.Uploaded,
      file,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return modelConfig;
  }

  public async updateUserConfigs(
    userId: string,
    data: UploadApiResponse,
  ): Promise<ModelConfigurationEntity> {
    let modelConfig = this.createNewConfig(data);
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
    data: UploadApiResponse,
  ): Promise<ModelConfigurationEntity> {
    let newConfig = this.createNewConfig(data);

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
  ): Promise<ModelConfigurationEntity | null> {
    if (anonymous) {
      return await this.setAnonymousUserConfigSnapshot(id, configId, snapshot);
    } else {
      return await this.setUserConfigSnapshot(id, configId, snapshot);
    }
  }

  public async setAnonymousUserConfigSnapshot(
    userId: string,
    configId: string,
    snapshot: string,
  ): Promise<ModelConfigurationEntity | null> {
    let configs = (await this.cacheManager.get(userId)) as
      | ModelConfigurationEntity[]
      | undefined;

    if (!configs) {
      throw new InternalServerErrorException(
        'Could not set snapshot for the configuration',
      );
    }

    let updatedConfig: ModelConfigurationEntity | null = null;

    configs = configs.map((config) => {
      if (config.id === configId) {
        updatedConfig = {
          ...config,
          snapshot,
        }

        return updatedConfig;
      }

      return config;
    });


    await this.cacheManager.set(
      userId,
      configs,
      CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
    );

    return updatedConfig;
  }

  public async setUserConfigSnapshot(
    userId: string,
    configId: string,
    snapshot: string,
  ): Promise<ModelConfigurationEntity | null> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { modelConfigurations: true },
    });

    if (!user) throw new BadRequestException('User not found');

    let updatedConfig: ModelConfigurationEntity | null = null;

    const configs = user.modelConfigurations.map((config) => {
      if (config.id === configId) {
        updatedConfig = {
          ...config,
          snapshot,
        };

        return updatedConfig;
      }

      return config;
    });
    user.modelConfigurations = configs;

    await this.userRepo.save(user);

    return updatedConfig;
  }

  public async getCustomerConfigurations(
    { id, anonymous }: JwtUserPayload
  ): Promise<ModelConfigurationEntity[]> {
    if (anonymous) {
      return await this.getAnonymousCustomerConfigs(id);
    }
    else {
      return await this.getCustomerConfigs(id);
    }
  }

  public async getAnonymousCustomerConfigs(userId: string): Promise<ModelConfigurationEntity[]> {
    return (await this.cacheManager.get(userId)) ?? [];
  }

  public async getCustomerConfigs(userId: string): Promise<ModelConfigurationEntity[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { modelConfigurations: true }
    });

    if (!user) throw new BadRequestException('User not found');

    return user.modelConfigurations;
  }


  public async getTotalCustomerConfigs(
    { id, anonymous }: JwtUserPayload
  ): Promise<ConfigCount> {
    if (anonymous) {
      return await this.getAnonymousCustomerConfigCount(id);
    }
    else {
      return await this.getCustomerConfigCount(id);
    }
  }

  public async getActiveConfig(
    { id, anonymous }: JwtUserPayload,
    activeConfigId: string
  ): Promise<undefined | ModelConfigurationEntity> {
    if (anonymous) {
      return await this.getAnonymousUserActiveConfig(id, activeConfigId)
    }
    else {
      return await this.getUserActiveConfig(id, activeConfigId)
    }
  }

  public async getAnonymousUserActiveConfig(
    userId: string,
    configId: string
  ): Promise<undefined | ModelConfigurationEntity> {
    const configs = (await this.cacheManager.get(userId) as ModelConfigurationEntity[]) ?? [];
    
    if (!configs.length) {
      return undefined;
    }
    else {
      return configs.find(config => config.id === configId)
    }
  }

  public async getUserActiveConfig(
    userId: string,
    configId: string
  ): Promise<undefined | ModelConfigurationEntity> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { modelConfigurations: true }
    });

    if (!user) throw new BadRequestException('User not found');

    return user.modelConfigurations.find(config => config.id === configId);

  }

  public async getAnonymousCustomerConfigCount(userId: string): Promise<ConfigCount> {
    const configs = await this.cacheManager.get(userId);
    if (configs) {
      return { total: (configs as ModelConfigurationEntity[]).length }
    }
    else {
      return { total: 0 }
    }

  }

  public async getCustomerConfigCount(userId: string): Promise<ConfigCount> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { modelConfigurations: true }
    });

    if (!user) throw new BadRequestException('User not found');

    return { total: user.modelConfigurations.length };
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
