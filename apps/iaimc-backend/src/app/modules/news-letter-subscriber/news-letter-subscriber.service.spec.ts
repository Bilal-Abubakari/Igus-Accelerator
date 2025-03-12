import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';
import { NewsLetterSubscriberService } from './news-letter-subscriber.service';
import { NewsLetterSubscriberEntity } from './entities/new-letter-subscriber.entity';
import { NewsLetterSubscriberDto } from './dtos/news-letter-subscriber.dto';
import { FindOneOptions } from 'typeorm';

type MockRepository<T> = {
  findOne: jest.Mock<Promise<T | null>, [FindOneOptions<T>]>;
  create: jest.Mock<T, [Partial<T>]>;
  save: jest.Mock<Promise<T>, [T]>;
};

type MockMailerService = {
  sendMail: jest.Mock<Promise<unknown>, [Record<string, unknown>]>;
};

describe('NewsLetterSubscriberService', () => {
  let service: NewsLetterSubscriberService;
  let repositoryMock: MockRepository<NewsLetterSubscriberEntity>;
  let mailerServiceMock: MockMailerService;

  const mockSubscriberDto: NewsLetterSubscriberDto = {
    email: 'test@example.com',
    firstName: 'John'
  };

  const mockSubscriberEntity: NewsLetterSubscriberEntity = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    repositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    };

    mailerServiceMock = {
      sendMail: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsLetterSubscriberService,
        {
          provide: getRepositoryToken(NewsLetterSubscriberEntity),
          useValue: repositoryMock
        },
        {
          provide: MailerService,
          useValue: mailerServiceMock
        }
      ],
    }).compile();

    service = module.get<NewsLetterSubscriberService>(NewsLetterSubscriberService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new subscriber and send welcome email for new user', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      repositoryMock.create.mockReturnValue(mockSubscriberEntity);
      repositoryMock.save.mockResolvedValue(mockSubscriberEntity);
      mailerServiceMock.sendMail.mockResolvedValue({});

      await service.create(mockSubscriberDto);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: mockSubscriberDto.email }
      });
      expect(repositoryMock.create).toHaveBeenCalledWith(mockSubscriberDto);
      expect(repositoryMock.save).toHaveBeenCalledWith(mockSubscriberEntity);
      expect(mailerServiceMock.sendMail).toHaveBeenCalled();
      expect(mailerServiceMock.sendMail.mock.calls[0][0]).toHaveProperty('to', mockSubscriberDto.email);
    });

    it('should update firstName if subscriber exists with different name', async () => {
      const existingSubscriber = { ...mockSubscriberEntity, firstName: 'OldName' };
      repositoryMock.findOne.mockResolvedValue(existingSubscriber);
      repositoryMock.save.mockResolvedValue({ ...existingSubscriber, firstName: mockSubscriberDto.firstName });
      mailerServiceMock.sendMail.mockResolvedValue({});

      await service.create(mockSubscriberDto);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: mockSubscriberDto.email }
      });
      expect(repositoryMock.create).not.toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalledWith({
        ...existingSubscriber,
        firstName: mockSubscriberDto.firstName
      });
      expect(mailerServiceMock.sendMail).toHaveBeenCalled();
    });

    it('should not update if subscriber exists with same name', async () => {
      repositoryMock.findOne.mockResolvedValue(mockSubscriberEntity);
      mailerServiceMock.sendMail.mockResolvedValue({});

      await service.create(mockSubscriberDto);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: mockSubscriberDto.email }
      });
      expect(repositoryMock.create).not.toHaveBeenCalled();
      expect(repositoryMock.save).not.toHaveBeenCalled();
      expect(mailerServiceMock.sendMail).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      const error = new Error('Database error');
      repositoryMock.findOne.mockRejectedValue(error);

      await expect(service.create(mockSubscriberDto)).rejects.toThrow(
        new InternalServerErrorException(`Failed to create newsletter subscriber ${error.message}`)
      );
      expect(mailerServiceMock.sendMail).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if mailer service throws an error', async () => {
      const error = new Error('Email sending error');
      repositoryMock.findOne.mockResolvedValue(null);
      repositoryMock.create.mockReturnValue(mockSubscriberEntity);
      repositoryMock.save.mockResolvedValue(mockSubscriberEntity);
      mailerServiceMock.sendMail.mockRejectedValue(error);

      await expect(service.create(mockSubscriberDto)).rejects.toThrow(
        new InternalServerErrorException(`Failed to create newsletter subscriber Failed to send welcome email ${error.message}`)
      );
    });
  });

  describe('getWelcomeEmailTemplate', () => {
    it('should include the firstName in the email template', async () => {
      repositoryMock.findOne.mockResolvedValue(null);
      repositoryMock.create.mockReturnValue(mockSubscriberEntity);
      repositoryMock.save.mockResolvedValue(mockSubscriberEntity);

      await service.create(mockSubscriberDto);

      const emailCall = mailerServiceMock.sendMail.mock.calls[0][0];
      expect(emailCall.html).toContain(`Hello ${mockSubscriberDto.firstName}`);
      expect(emailCall.subject).toBe('Welcome to Our Newsletter!');
      expect(emailCall.from).toBe(process.env.EMAIL_USER);
    });
  });
});
