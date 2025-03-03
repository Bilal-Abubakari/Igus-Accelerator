import { Test, TestingModule } from '@nestjs/testing';
import { ContactFormController } from './contact-form.controller';
import { ContactFormService } from './contact-form.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { ContactFormEntity } from './entity/contact-form.entity';
import { Readable } from 'stream';

const mockContactFormService = {
  createForm: jest.fn(),
};

const baseDto: ContactFormDto = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  company: 'Acme Inc.',
  postalCode: '54321',
  country: 'USA',
  agreement: true,
};

describe('ContactFormController', () => {
  let controller: ContactFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactFormController],
      providers: [
        { provide: ContactFormService, useValue: mockContactFormService },
      ],
    }).compile();

    controller = module.get<ContactFormController>(ContactFormController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should submit a contact form without file', async () => {
    const dto: ContactFormDto = {
      ...baseDto,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      postalCode: '12345',
    };

    const expectedResult: ContactFormEntity = {
      id: 1,
      ...dto,
      fileUrl: 'file.example.stp',
      createdAt: new Date('2023-01-01'),
    };

    (mockContactFormService.createForm as jest.Mock).mockResolvedValueOnce(
      expectedResult,
    );

    const result = await controller.submitForm(dto);

    expect(mockContactFormService.createForm).toHaveBeenCalledWith(
      dto,
      undefined,
    );
    expect(result).toEqual(expectedResult);
  });

  it('should submit a contact form with file', async () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'dummy.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 1024,
      buffer: Buffer.from('dummy file content'),
      stream: Readable.from(['dummy file content']),
      destination: '',
      filename: '',
      path: '',
    };

    const expectedResult: ContactFormEntity = {
      id: 2,
      ...baseDto,
      fileUrl: 'https://cloudinary.com/fake-url',
      createdAt: new Date('2023-01-01'),
    };

    (mockContactFormService.createForm as jest.Mock).mockResolvedValueOnce(
      expectedResult,
    );

    const result = await controller.submitForm(baseDto, file);

    expect(mockContactFormService.createForm).toHaveBeenCalledWith(baseDto, file);
    expect(result).toEqual(expectedResult);
  });

  it('should propagate errors from the service', async () => {
    const dto: ContactFormDto = {
      ...baseDto,
      firstName: 'Error',
      lastName: 'Case',
      email: 'error@example.com',
      postalCode: '00000',
    };

    const error = new Error('Service error');
    (mockContactFormService.createForm as jest.Mock).mockRejectedValueOnce(
      error,
    );

    await expect(controller.submitForm(dto)).rejects.toThrow('Service error');
    expect(mockContactFormService.createForm).toHaveBeenCalledWith(
      dto,
      undefined,
    );
  });
});

export { ContactFormController };