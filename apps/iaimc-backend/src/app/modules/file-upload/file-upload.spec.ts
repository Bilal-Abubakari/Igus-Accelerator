import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';
import { FileStoreDirectory, MulterFile } from '../../common/types/file.types';
import { FileUploadService } from './file-upload.service';

jest.mock('cloudinary');

describe('FileUploadService', () => {
  let service: FileUploadService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'CLOUDINARY_CLOUD_NAME':
                  return 'test_cloud_name';
                case 'CLOUDINARY_API_KEY':
                  return 'test_api_key';
                case 'CLOUDINARY_API_SECRET':
                  return 'test_api_secret';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    loggerSpy = jest.spyOn(service['logger'], 'error');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if cloudinary fails to upload a file', async () => {
    const file = {
      originalname: 'test.txt',
      buffer: Buffer.from('test'),
    } as MulterFile;
    const directory = FileStoreDirectory.MODELS;

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_, callback) => {
        callback(new Error('Upload failed'), null);
      },
    );

    await expect(service.uploadFile(file, directory)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerSpy).toHaveBeenCalled();
  });

  it('should go through successfully if file upload succeeds', async () => {
    const file = {
      originalname: 'test.txt',
      buffer: Buffer.from('test'),
    } as MulterFile;
    const directory = FileStoreDirectory.MODELS;

    const mockResult = { public_id: 'test_public_id', url: 'http://test.url' };
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (options, callback) => {
        callback(null, mockResult);
      },
    );

    const result = await service.uploadFile(file, directory);

    expect(result.data).toEqual(mockResult);
  });
});
