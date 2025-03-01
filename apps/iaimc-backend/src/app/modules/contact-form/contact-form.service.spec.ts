import { Test, TestingModule } from '@nestjs/testing';
import { ContactFormService } from './contact-form.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContactFormEntity } from './entity/contact-form.entity';
import { Repository } from 'typeorm';
import { ContactFormDto } from './dto/contact-form.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileStoreDirectory } from '../../common/types';

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
    const dto: ContactFormDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Acme Inc.',
      postalCode: '12345',
      country: 'USA',
      agreement: true,
    };
    const createdEntity = { id: 1, ...dto };

    (mockRepository.create as jest.Mock).mockReturnValue(dto);
    (mockRepository.save as jest.Mock).mockResolvedValue(createdEntity);

    const result = await service.createForm(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdEntity);
    expect(mockFileUploadService.uploadFile).not.toHaveBeenCalled();
  });

  it('should create a contact form with file and set fileId', async () => {
    const dto: ContactFormDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      company: 'Acme Inc.',
      postalCode: '54321',
      country: 'USA',
      agreement: true,
    };

    const file = {
      fieldname: 'file',
      originalname: 'dummy.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 1024,
      buffer: Buffer.from('dummy file content'),
      destination: '',
      filename: '',
      path: '',
    } as unknown as Express.Multer.File;

    const secureUrl = 'https://cloudinary.com/fake-url';
    (mockFileUploadService.uploadFile as jest.Mock).mockResolvedValue({
      data: { secure_url: secureUrl },
    });
    const createdEntity = { id: 2, ...dto, fileId: secureUrl };

    (mockRepository.create as jest.Mock).mockReturnValue(dto);
    (mockRepository.save as jest.Mock).mockResolvedValue(createdEntity);

    const result = await service.createForm(dto, file);

    expect(mockFileUploadService.uploadFile).toHaveBeenCalledWith(
      file,
      FileStoreDirectory.CONTACT_FORMS,
    );
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdEntity);
  });

  it('should propagate an error if file upload fails', async () => {
    const dto: ContactFormDto = {
      firstName: 'Emily',
      lastName: 'Stone',
      email: 'emily@example.com',
      company: 'Acme Inc.',
      postalCode: '67890',
      country: 'USA',
      agreement: true,
    };

    const file = {
      fieldname: 'file',
      originalname: 'dummy.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 1024,
      buffer: Buffer.from('dummy file content'),
      destination: '',
      filename: '',
      path: '',
    } as unknown as Express.Multer.File;

    const uploadError = new Error('Upload failed');
    (mockFileUploadService.uploadFile as jest.Mock).mockRejectedValue(
      uploadError,
    );
    (mockRepository.create as jest.Mock).mockReturnValue(dto);

    await expect(service.createForm(dto, file)).rejects.toThrow(
      'Upload failed',
    );
    expect(mockFileUploadService.uploadFile).toHaveBeenCalledWith(
      file,
      FileStoreDirectory.CONTACT_FORMS,
    );
  });

  it('should propagate an error if repository.save fails', async () => {
    const dto: ContactFormDto = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      company: 'Acme Inc.',
      postalCode: '11111',
      country: 'USA',
      agreement: true,
    };

    (mockRepository.create as jest.Mock).mockReturnValue(dto);
    const saveError = new Error('Database save error');
    (mockRepository.save as jest.Mock).mockRejectedValue(saveError);

    await expect(service.createForm(dto)).rejects.toThrow(
      'Database save error',
    );
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(dto);
  });
});
