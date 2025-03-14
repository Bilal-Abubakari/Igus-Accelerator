import { Test, TestingModule } from '@nestjs/testing';
import { ModelConfigController } from './model-config.controller';
import { ModelConfigService } from './model-config.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtUserPayload } from '../../common/types/general.types';
import { MulterFile } from '../../common/types/file.types';
import { ModelConfigurationEntity, ConfigCount, ReviewStatus } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { ModelSnapshotDto } from './dtos/model-snapshot.dto';
import { Readable } from 'stream';

describe('ModelConfigController', () => {
    let controller: ModelConfigController;
    let modelConfigService: ModelConfigService;

    const mockUser: JwtUserPayload = {
        id: 'user-id-1',
        anonymous: false
    };

    const mockRequest = () => {
        return {
            user: mockUser,
        };
    };

    const mockRequestNoUser = () => {
        return {
            user: null,
        };
    };

    const mockFile: MulterFile = {
        fieldname: 'file',
        originalname: 'test-model.step',
        encoding: '7bit',
        mimetype: 'application/step',
        buffer: Buffer.from('test file content'),
        size: 1024,
        stream: Readable.from(Buffer.from('test file content')),
        destination: './',
        filename: 'test-model.step',
        path: './test-model.step',
    };

    const mockModelConfig: ModelConfigurationEntity = {
        id: 'config-id-1',
        material: 'A160',
        reviewStatus: ReviewStatus.Uploaded,
        quantity: 1,
        file: {
            assetFolder: '',
            checksum: "4354657465",
            id: "adsf",
            name: "file.step",
            type: 'step',
            uploadDate: new Date(),
            url: "file-url"
        },
        snapshot: 'base64-snapshot-data',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockModelConfigService = {
        uploadConfig: jest.fn().mockImplementation((user, file) => {
            return Promise.resolve(mockModelConfig);
        }),
        setConfigSnapshot: jest.fn().mockImplementation((user, configId, snapshot) => {
            return Promise.resolve({ ...mockModelConfig, snapshot });
        }),
        getCustomerConfigurations: jest.fn().mockImplementation((user) => {
            return Promise.resolve([mockModelConfig]);
        }),
        getTotalCustomerConfigs: jest.fn().mockImplementation((user) => {
            return Promise.resolve({ count: 1 });
        }),
        getActiveConfig: jest.fn().mockImplementation((user, configId) => {
            return Promise.resolve(mockModelConfig);
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ModelConfigController],
            providers: [
                {
                    provide: ModelConfigService,
                    useValue: mockModelConfigService,
                },
            ],
        }).compile();

        controller = module.get<ModelConfigController>(ModelConfigController);
        modelConfigService = module.get<ModelConfigService>(ModelConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // describe('configurationUpload', () => {
    //     it('should upload configuration successfully', async () => {
    //         const result = await controller.configurationUpload(mockFile, mockRequest() as any);

    //         expect(result).toEqual(mockModelConfig);
    //         expect(modelConfigService.uploadConfig).toHaveBeenCalledWith(mockUser, mockFile);
    //     });

    //     it('should throw UnauthorizedException when user is not authenticated', async () => {
    //         await expect(controller.configurationUpload(mockFile, mockRequestNoUser() as any))
    //             .rejects
    //             .toThrow(UnauthorizedException);

    //         expect(modelConfigService.uploadConfig).not.toHaveBeenCalled();
    //     });
    // });

    // describe('setModelSnapshot', () => {
    //     const snapshotDto: ModelSnapshotDto = { snapshot: 'new-base64-snapshot' };
    //     const configId = 'config-id-1';

    //     it('should set model snapshot successfully', async () => {
    //         const expectedResult = { ...mockModelConfig, snapshot: snapshotDto.snapshot };
    //         mockModelConfigService.setConfigSnapshot.mockResolvedValueOnce(expectedResult);

    //         const result = await controller.setModelSnapshot(configId, snapshotDto, mockRequest() as any);

    //         expect(result).toEqual(expectedResult);
    //         expect(modelConfigService.setConfigSnapshot).toHaveBeenCalledWith(mockUser, configId, snapshotDto.snapshot);
    //     });

    //     it('should throw UnauthorizedException when user is not authenticated', async () => {
    //         await expect(controller.setModelSnapshot(configId, snapshotDto, mockRequestNoUser() as any))
    //             .rejects
    //             .toThrow(UnauthorizedException);

    //         expect(modelConfigService.setConfigSnapshot).not.toHaveBeenCalled();
    //     });
    // });

    // describe('getCustomerConfigs', () => {
    //     it('should get customer configurations successfully', async () => {
    //         const expectedResult = [mockModelConfig];
    //         mockModelConfigService.getCustomerConfigurations.mockResolvedValueOnce(expectedResult);

    //         const result = await controller.getCustomerConfigs(mockRequest() as any);

    //         expect(result).toEqual(expectedResult);
    //         expect(modelConfigService.getCustomerConfigurations).toHaveBeenCalledWith(mockUser);
    //     });

    //     it('should throw UnauthorizedException when user is not authenticated', async () => {
    //         await expect(controller.getCustomerConfigs(mockRequestNoUser() as any))
    //             .rejects
    //             .toThrow(UnauthorizedException);

    //         expect(modelConfigService.getCustomerConfigurations).not.toHaveBeenCalled();
    //     });
    // });

    // describe('getTotalConfigs', () => {
    //     it('should get total configurations count successfully', async () => {
    //         const expectedResult: ConfigCount = { total: 1 };
    //         mockModelConfigService.getTotalCustomerConfigs.mockResolvedValueOnce(expectedResult);

    //         const result = await controller.getTotalConfigs(mockRequest() as any);

    //         expect(result).toEqual(expectedResult);
    //         expect(modelConfigService.getTotalCustomerConfigs).toHaveBeenCalledWith(mockUser);
    //     });

    //     it('should throw UnauthorizedException when user is not authenticated', async () => {
    //         await expect(controller.getTotalConfigs(mockRequestNoUser() as any))
    //             .rejects
    //             .toThrow(UnauthorizedException);

    //         expect(modelConfigService.getTotalCustomerConfigs).not.toHaveBeenCalled();
    //     });
    // });

    // describe('getActiveConfig', () => {
    //     const configId = 'config-id-1';

    //     it('should get active configuration successfully', async () => {
    //         const expectedResult = mockModelConfig;
    //         mockModelConfigService.getActiveConfig.mockResolvedValueOnce(expectedResult);

    //         const result = await controller.getActiveConfig(configId, mockRequest() as any);

    //         expect(result).toEqual(expectedResult);
    //         expect(modelConfigService.getActiveConfig).toHaveBeenCalledWith(mockUser, configId);
    //     });

    //     it('should throw UnauthorizedException when user is not authenticated', async () => {
    //         await expect(controller.getActiveConfig(configId, mockRequestNoUser() as any))
    //             .rejects
    //             .toThrow(UnauthorizedException);

    //         expect(modelConfigService.getActiveConfig).not.toHaveBeenCalled();
    //     });
    // });
});
