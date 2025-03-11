import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { UploadApiResponse } from 'cloudinary';
import { Repository } from 'typeorm';
import { UserEntity } from '../../common/entities/user.entity';
import { JwtUserPayload } from '../../common/types/general.types';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ModelConfigurationEntity } from './entities/configuration.entity';
import { FileEntity } from './entities/file.entity';
import {
  CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
  ModelConfigService,
} from './model-config.service';

interface MockFile {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
}

interface MockUser extends Partial<UserEntity> {
  id: string;
  modelConfigurations: ModelConfigurationEntity[];
}

interface MockModelConfig {
  id: string;
  file: Partial<FileEntity>;
  snapshot?: string | null;
}

const someUUID = 'aa77f9af-5d0d-4561-aab3-8c3eb41359b7';

jest.mock('uuid', () => ({
  v4: jest.fn(() => someUUID),
}));

const uploadResult: UploadApiResponse = {
  asset_id: 'abcd1234efgh5678',
  public_id: 'sample-folder/sample-image',
  version: 1709876543,
  version_id: '1234567890abcdef1234567890abcdef',
  signature: 'fakesignature1234567890abcdef',
  resource_type: 'image',
  created_at: '2025-03-09T12:34:56Z',
  tags: ['mock', 'cloudinary', 'test'],
  bytes: 204800,
  type: 'upload',
  etag: 'etag1234567890abcdef',
  placeholder: false,
  secure_url:
    'https://res.cloudinary.com/demo/image/upload/v1709876543/sample-folder/sample-image.jpg',
  asset_folder: 'sample-folder',
  display_name: 'sample-image',
  overwritten: false,
  original_filename: 'sample-image.jpg',
  api_key: '1234567890abcdef',
  access_control: [],
  access_mode: '',
  context: {},
  format: '',
  height: 1,
  metadata: {},
  moderation: [],
  pages: 1,
  url: '',
  width: 1,
};

const userId = 'user-id';
const configId = 'config-id';
const snapshot = 'snapshot-data';

describe('ModelConfigService', () => {
  let service: ModelConfigService;
  let userRepo: Repository<UserEntity>;
  let modelConfigRepo: Repository<ModelConfigurationEntity>;
  let fileRepo: Repository<FileEntity>;
  let cacheManager: Cache;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ModelConfigurationEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FileEntity),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ModelConfigService>(ModelConfigService);
    userRepo = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    modelConfigRepo = module.get<Repository<ModelConfigurationEntity>>(
      getRepositoryToken(ModelConfigurationEntity),
    );
    fileRepo = module.get<Repository<FileEntity>>(
      getRepositoryToken(FileEntity),
    );
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Upload config', () => {
    it('should upload config for anonymous user', async () => {
      const jwtPayload: JwtUserPayload = { id: 'user-id', anonymous: true };
      const file: MockFile = { buffer: Buffer.from('file-content') };
      jest
        .spyOn(fileUploadService, 'uploadFile')
        .mockResolvedValue({ data: uploadResult });
      jest
        .spyOn(service, 'updateAnonymousUserConfigs')
        .mockResolvedValue({} as ModelConfigurationEntity);

      await service.uploadConfig(
        jwtPayload,
        file as unknown as Express.Multer.File,
      );

      expect(fileUploadService.uploadFile).toHaveBeenCalledWith(file, 'models');
      expect(service.updateAnonymousUserConfigs).toHaveBeenCalledWith(
        jwtPayload.id,
        uploadResult,
      );
    });

    it('should upload config for registered user', async () => {
      const jwtPayload: JwtUserPayload = { id: 'user-id', anonymous: false };
      const file: MockFile = { buffer: Buffer.from('file-content') };
      jest
        .spyOn(fileUploadService, 'uploadFile')
        .mockResolvedValue({ data: uploadResult });
      jest
        .spyOn(service, 'updateUserConfigs')
        .mockResolvedValue({} as ModelConfigurationEntity);

      await service.uploadConfig(
        jwtPayload,
        file as unknown as Express.Multer.File,
      );

      expect(fileUploadService.uploadFile).toHaveBeenCalledWith(file, 'models');
      expect(service.updateUserConfigs).toHaveBeenCalledWith(
        jwtPayload.id,
        uploadResult,
      );
    });
  });

  describe('Create new config', () => {
    it('should create a new config with generated IDs when generateIds is true', () => {
      jest
        .spyOn(fileRepo, 'create')
        .mockImplementation((entity) => entity as FileEntity);
      jest
        .spyOn(modelConfigRepo, 'create')
        .mockImplementation((entity) => entity as ModelConfigurationEntity);

      const result = service.createNewConfig(uploadResult);

      expect(fileRepo.create).toHaveBeenCalledWith({
        id: someUUID,
        name: 'sample-image',
        type: 'sample-image',
        url: 'https://res.cloudinary.com/demo/image/upload/v1709876543/sample-folder/sample-image.jpg',
        checksum: 'etag1234567890abcdef',
        assetFolder: 'sample-folder',
        uploadDate: '2025-03-09T12:34:56Z',
      });

      expect(modelConfigRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: someUUID,
          material: 'A160',
          quantity: 1,
          lifeTime: null,
          reviewStatus: 'Unsubmitted',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );

      expect(result.file).toBeDefined();
    });

    it('should create a new config without generated IDs when generateIds is false', () => {
      jest
        .spyOn(fileRepo, 'create')
        .mockImplementation((entity) => entity as FileEntity);
      jest
        .spyOn(modelConfigRepo, 'create')
        .mockImplementation((entity) => entity as ModelConfigurationEntity);

      service.createNewConfig(uploadResult);

      expect(fileRepo.create).toHaveBeenCalledWith({
        id: someUUID,
        name: 'sample-image',
        type: 'sample-image',
        url: 'https://res.cloudinary.com/demo/image/upload/v1709876543/sample-folder/sample-image.jpg',
        checksum: 'etag1234567890abcdef',
        assetFolder: 'sample-folder',
        uploadDate: '2025-03-09T12:34:56Z',
      });

      expect(modelConfigRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: someUUID,
          material: 'A160',
          quantity: 1,
          lifeTime: null,
          reviewStatus: 'Unsubmitted',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('Update user configs', () => {
    it('should update user configs', async () => {
      const user: MockUser = { id: userId, modelConfigurations: [] };
      const modelConfig: MockModelConfig = { id: 'config-id', file: {} };

      jest
        .spyOn(service, 'createNewConfig')
        .mockReturnValue(modelConfig as ModelConfigurationEntity);
      jest
        .spyOn(fileRepo, 'save')
        .mockResolvedValue(modelConfig.file as FileEntity);
      jest
        .spyOn(modelConfigRepo, 'save')
        .mockResolvedValue(modelConfig as ModelConfigurationEntity);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as UserEntity);
      jest.spyOn(userRepo, 'save').mockResolvedValue(user as UserEntity);

      await service.updateUserConfigs(userId, uploadResult);

      expect(service.createNewConfig).toHaveBeenCalledWith(uploadResult);
      expect(fileRepo.save).toHaveBeenCalledWith(modelConfig.file);
      expect(modelConfigRepo.save).toHaveBeenCalledWith(modelConfig);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: { modelConfigurations: true },
      });
      expect(userRepo.save).toHaveBeenCalledWith(user);
    });

    it('should throw BadRequestException when user is not found', async () => {
      const modelConfig: MockModelConfig = { id: 'config-id', file: {} };

      jest
        .spyOn(service, 'createNewConfig')
        .mockReturnValue(modelConfig as ModelConfigurationEntity);
      jest
        .spyOn(fileRepo, 'save')
        .mockResolvedValue(modelConfig.file as FileEntity);
      jest
        .spyOn(modelConfigRepo, 'save')
        .mockResolvedValue(modelConfig as ModelConfigurationEntity);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateUserConfigs(userId, uploadResult),
      ).rejects.toThrow(new BadRequestException('User not found'));

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: { modelConfigurations: true },
      });
    });

    it('should throw InternalServerErrorException when file upload service returns undefined data', async () => {
      const jwtPayload: JwtUserPayload = { id: 'user-id', anonymous: true };
      const file: MockFile = { buffer: Buffer.from('file-content') };

      jest
        .spyOn(fileUploadService, 'uploadFile')
        .mockResolvedValue({ data: undefined });

      await expect(
        service.uploadConfig(
          jwtPayload,
          file as unknown as Express.Multer.File,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException('Could not upload configuration'),
      );

      expect(fileUploadService.uploadFile).toHaveBeenCalledWith(file, 'models');

      const updateAnonymousSpy = jest.spyOn(
        service,
        'updateAnonymousUserConfigs',
      );
      const updateUserSpy = jest.spyOn(service, 'updateUserConfigs');

      expect(updateAnonymousSpy).not.toHaveBeenCalled();
      expect(updateUserSpy).not.toHaveBeenCalled();
    });
  });

  describe('Update anonymous user configs', () => {
    it('should update anonymous user configs', async () => {
      const newConfig: MockModelConfig = { id: 'config-id', file: {} };
      const configs: MockModelConfig[] = [newConfig];

      jest
        .spyOn(service, 'createNewConfig')
        .mockReturnValue(newConfig as ModelConfigurationEntity);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(configs);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.updateAnonymousUserConfigs(userId, uploadResult);

      expect(service.createNewConfig).toHaveBeenCalledWith(uploadResult);
      expect(cacheManager.get).toHaveBeenCalledWith(userId);
      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        configs,
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
    });

    it('should create new configs array when none exists', async () => {
      const newConfig: MockModelConfig = { id: 'config-id', file: {} };

      jest
        .spyOn(service, 'createNewConfig')
        .mockReturnValue(newConfig as ModelConfigurationEntity);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.updateAnonymousUserConfigs(
        userId,
        uploadResult,
      );

      expect(cacheManager.get).toHaveBeenCalledWith(userId);
      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        [newConfig],
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
      expect(result).toEqual(newConfig);
    });

    it('should handle duplicate configuration', async () => {
      const checksum = 'sadsfgfakm';
      const newConfig: MockModelConfig = {
        id: 'config-id',
        file: { name: 'sample-image', checksum },
      };
      const existingConfigs: MockModelConfig[] = [
        { id: 'existing-id', file: { name: 'sample-image', checksum } },
      ];

      jest
        .spyOn(service, 'createNewConfig')
        .mockReturnValue(newConfig as ModelConfigurationEntity);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(existingConfigs);
      jest
        .spyOn(service, 'findDuplicateConfig')
        .mockReturnValue(existingConfigs[0] as ModelConfigurationEntity);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.updateAnonymousUserConfigs(
        userId,
        uploadResult,
      );

      expect(service.findDuplicateConfig).toHaveBeenCalledWith(
        existingConfigs,
        newConfig,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        existingConfigs,
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
      expect(result).toEqual(existingConfigs[0]);
    });

    it('should add new config when no duplicate exists', async () => {
      const newConfig: MockModelConfig = {
        id: 'config-id',
        file: { name: 'sample-image', checksum: 'new-checksum' },
      };
      const existingConfigs: MockModelConfig[] = [
        {
          id: 'existing-id',
          file: { name: 'other-image', checksum: 'different-checksum' },
        },
      ];
      const expectedConfigs = [...existingConfigs, newConfig];

      jest
        .spyOn(service, 'createNewConfig')
        .mockReturnValue(newConfig as ModelConfigurationEntity);
      jest.spyOn(cacheManager, 'get').mockResolvedValue(existingConfigs);
      jest.spyOn(service, 'findDuplicateConfig').mockReturnValue(undefined);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      const result = await service.updateAnonymousUserConfigs(
        userId,
        uploadResult,
      );

      expect(service.findDuplicateConfig).toHaveBeenCalledWith(
        existingConfigs,
        newConfig,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        expectedConfigs,
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
      expect(result).toEqual(newConfig);
    });

    it('should find duplicate config based on name and checksum', () => {
      const configs: ModelConfigurationEntity[] = [
        {
          id: 'config-1',
          file: { name: 'file1.stl', checksum: 'checksum1' },
        } as ModelConfigurationEntity,
        {
          id: 'config-2',
          file: { name: 'file2.stl', checksum: 'checksum2' },
        } as ModelConfigurationEntity,
        {
          id: 'config-3',
          file: { name: 'file3.stl', checksum: 'checksum3' },
        } as ModelConfigurationEntity,
      ];

      const newConfig: ModelConfigurationEntity = {
        file: { name: 'file2.stl', checksum: 'checksum2' },
      } as ModelConfigurationEntity;

      const result = service.findDuplicateConfig(configs, newConfig);
      expect(result).toEqual(configs[1]);
    });

    it('should return undefined when no duplicate config is found', () => {
      const configs: ModelConfigurationEntity[] = [
        {
          id: 'config-1',
          file: { name: 'file1.stl', checksum: 'checksum1' },
        } as ModelConfigurationEntity,
        {
          id: 'config-2',
          file: { name: 'file2.stl', checksum: 'checksum2' },
        } as ModelConfigurationEntity,
      ];

      const newConfig: ModelConfigurationEntity = {
        file: { name: 'file3.stl', checksum: 'checksum3' },
      } as ModelConfigurationEntity;

      const result = service.findDuplicateConfig(configs, newConfig);
      expect(result).toBeUndefined();
    });
  });

  describe('Set config snapshot', () => {
    it('should set config snapshot for anonymous user', async () => {
      const jwtPayload: JwtUserPayload = { id: 'user-id', anonymous: true };

      jest
        .spyOn(service, 'setAnonymousUserConfigSnapshot')
        .mockResolvedValue(undefined);

      await service.setConfigSnapshot(jwtPayload, configId, snapshot);

      expect(service.setAnonymousUserConfigSnapshot).toHaveBeenCalledWith(
        jwtPayload.id,
        configId,
        snapshot,
      );
    });

    it('should set config snapshot for registered user', async () => {
      const jwtPayload: JwtUserPayload = { id: 'user-id', anonymous: false };
      jest.spyOn(service, 'setUserConfigSnapshot').mockResolvedValue(undefined);
      await service.setConfigSnapshot(jwtPayload, configId, snapshot);

      expect(service.setUserConfigSnapshot).toHaveBeenCalledWith(
        jwtPayload.id,
        configId,
        snapshot,
      );
    });
  });

  describe('set anonymousUser config snapshot', () => {
    it('should set anonymous user config snapshot', async () => {
      const configs: MockModelConfig[] = [
        { id: configId, file: {}, snapshot: null },
      ];

      jest.spyOn(cacheManager, 'get').mockResolvedValue(configs);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.setAnonymousUserConfigSnapshot(userId, configId, snapshot);

      expect(cacheManager.get).toHaveBeenCalledWith(userId);
      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        [{ id: configId, file: {}, snapshot }],
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
    });

    it('should throw error when configs are not found', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);

      await expect(
        service.setAnonymousUserConfigSnapshot(userId, configId, snapshot),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'Could not set snapshot for the configuration',
        ),
      );

      expect(cacheManager.get).toHaveBeenCalledWith(userId);
    });

    it('should update snapshot for matching config among multiple configs', async () => {
      const configs: MockModelConfig[] = [
        { id: 'other-id', file: {}, snapshot: 'old-snapshot' },
        { id: configId, file: {}, snapshot: null },
      ];

      const expectedUpdatedConfigs: MockModelConfig[] = [
        { id: 'other-id', file: {}, snapshot: 'old-snapshot' },
        { id: configId, file: {}, snapshot: 'snapshot-data' },
      ];

      jest.spyOn(cacheManager, 'get').mockResolvedValue(configs);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.setAnonymousUserConfigSnapshot(userId, configId, snapshot);

      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        expectedUpdatedConfigs,
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
    });

    it('should not modify non-matching configs', async () => {
      const nonMatchingConfig: MockModelConfig = {
        id: 'other-id',
        file: {},
        snapshot: 'old-snapshot',
      };
      const configs: MockModelConfig[] = [nonMatchingConfig];

      jest.spyOn(cacheManager, 'get').mockResolvedValue(configs);
      jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

      await service.setAnonymousUserConfigSnapshot(userId, configId, snapshot);

      expect(cacheManager.set).toHaveBeenCalledWith(
        userId,
        [nonMatchingConfig],
        CONFIGURATION_CACHE_EXPIRATION_TIME_MS,
      );
    });
  });

  describe('Set user config snapshot', () => {
    it('should set user config snapshot', async () => {
      const user: MockUser = {
        id: userId,
        modelConfigurations: [
          {
            id: configId,
            file: {},
            snapshot: null,
          } as unknown as ModelConfigurationEntity,
        ],
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as UserEntity);
      jest.spyOn(userRepo, 'save').mockResolvedValue(user as UserEntity);

      await service.setUserConfigSnapshot(userId, configId, snapshot);

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: { modelConfigurations: true },
      });
      expect(userRepo.save).toHaveBeenCalledWith({
        ...user,
        modelConfigurations: [{ id: configId, file: {}, snapshot }],
      });
    });

    it('should handle case when no configurations match the configId', async () => {
      const user: MockUser = {
        id: userId,
        modelConfigurations: [
          {
            id: 'config-789',
            file: {},
            snapshot: 'existing-snapshot',
          } as ModelConfigurationEntity,
          {
            id: 'config-101',
            file: {},
            snapshot: 'another-snapshot',
          } as ModelConfigurationEntity,
        ],
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as UserEntity);
      jest.spyOn(userRepo, 'save').mockResolvedValue(user as UserEntity);

      await service.setUserConfigSnapshot(userId, configId, snapshot);

      expect(userRepo.save).toHaveBeenCalledWith(user);
    });
  });
});
