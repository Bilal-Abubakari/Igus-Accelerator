import { Test, TestingModule } from '@nestjs/testing';
import { ContactFormService } from './contact-form.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContactFormEntity } from './entity/contact-form.entity';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileStoreDirectory } from '../../common/types/file.types';
import {
  mockContactFormDto,
  mockFile,
  errorContactFormDto,
} from './contact-form.mock';

describe('ContactFormService', () => {
  let service: ContactFormService;

  const mockRepository: Partial<Repository<ContactFormEntity>> = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockFileUploadService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactFormService,
        {
          provide: getRepositoryToken(ContactFormEntity),
          useValue: mockRepository,
        },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    service = module.get<ContactFormService>(ContactFormService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact form without file', async () => {
    const createdEntity = { id: 1, ...mockContactFormDto };

    (mockRepository.create as jest.Mock).mockReturnValue(mockContactFormDto);
    (mockRepository.save as jest.Mock).mockResolvedValue(createdEntity);

    const result = await service.createForm(mockContactFormDto);

    expect(mockRepository.create).toHaveBeenCalledWith(mockContactFormDto);
    expect(mockRepository.save).toHaveBeenCalledWith(mockContactFormDto);
    expect(result).toEqual(createdEntity);
    expect(mockFileUploadService.uploadFile).not.toHaveBeenCalled();
  });

  it('should create a contact form with file and set fileId', async () => {
    const secureUrl = 'https://cloudinary.com/fake-url';
    (mockFileUploadService.uploadFile as jest.Mock).mockResolvedValue({
      data: { secure_url: secureUrl },
    });
    const createdEntity = {
      id: 2,
      ...mockContactFormDto,
      fileUrl: secureUrl,
    };

    (mockRepository.create as jest.Mock).mockReturnValue(mockContactFormDto);
    (mockRepository.save as jest.Mock).mockResolvedValue(createdEntity);

    const result = await service.createForm(mockContactFormDto, mockFile);

    expect(mockFileUploadService.uploadFile).toHaveBeenCalledWith(
      mockFile,
      FileStoreDirectory.CONTACT_FORMS,
    );
    expect(mockRepository.create).toHaveBeenCalledWith(mockContactFormDto);
    expect(mockRepository.save).toHaveBeenCalledWith(mockContactFormDto);
    expect(result).toEqual(createdEntity);
  });

  it('should propagate an error if file upload fails', async () => {
    const uploadError = new Error('Upload failed');
    (mockFileUploadService.uploadFile as jest.Mock).mockRejectedValue(
      uploadError,
    );
    (mockRepository.create as jest.Mock).mockReturnValue(errorContactFormDto);

    await expect(
      service.createForm(errorContactFormDto, mockFile),
    ).rejects.toThrow('Upload failed');
    expect(mockFileUploadService.uploadFile).toHaveBeenCalledWith(
      mockFile,
      FileStoreDirectory.CONTACT_FORMS,
    );
  });

  it('should propagate an error if repository.save fails', async () => {
    (mockRepository.create as jest.Mock).mockReturnValue(errorContactFormDto);
    const saveError = new Error('Database save error');
    (mockRepository.save as jest.Mock).mockRejectedValue(saveError);

    await expect(service.createForm(errorContactFormDto)).rejects.toThrow(
      'Database save error',
    );
    expect(mockRepository.create).toHaveBeenCalledWith(errorContactFormDto);
    expect(mockRepository.save).toHaveBeenCalledWith(errorContactFormDto);
  });
});
