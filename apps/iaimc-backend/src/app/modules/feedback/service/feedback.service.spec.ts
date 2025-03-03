import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackEntity } from '../feedback.entity';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { EmailDto } from '../dtos/email.dto';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let repository: Repository<FeedbackEntity>;

  const mockCreateFeedbackDto: CreateFeedbackDto = {
    comment: 'Test feedback',
    rating: 5,
  };

  const mockEmailDto: EmailDto = {
    email: 'test@example.com',
  };

  const mockFeedbackEntity: FeedbackEntity = {
    id: 'feedback123',
    rating: 5,
    comment: 'Test feedback',
    email: 'example@gmail.com',
    createdAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(FeedbackEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    repository = module.get<Repository<FeedbackEntity>>(
      getRepositoryToken(FeedbackEntity),
    );
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createFeedback', () => {
    it('should create and save feedback successfully', async () => {
      mockRepository.create.mockReturnValue(mockFeedbackEntity);
      mockRepository.save.mockResolvedValue(mockFeedbackEntity);

      const result = await service.createFeedback(mockCreateFeedbackDto);

      expect(repository.create).toHaveBeenCalledWith(mockCreateFeedbackDto);
      expect(repository.save).toHaveBeenCalledWith(mockFeedbackEntity);
      expect(result).toEqual({ id: mockFeedbackEntity.id });
    });

    it('should throw InternalServerErrorException when create fails', async () => {
      mockRepository.create.mockReturnValue(mockFeedbackEntity);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createFeedback(mockCreateFeedbackDto))
        .rejects.toThrow('Failed to create feedback');

      expect(repository.create).toHaveBeenCalledWith(mockCreateFeedbackDto);
      expect(repository.save).toHaveBeenCalledWith(mockFeedbackEntity);
    });
  });

  describe('sendEmail', () => {
    it('should update feedback with email data successfully', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockFeedbackEntity);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.sendEmail(mockEmailDto, 'feedback123');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'feedback123' });
      expect(repository.update).toHaveBeenCalledWith('feedback123', mockEmailDto);
    });

    it('should throw InternalServerErrorException when no feedbackId is provided', async () => {
      await expect(service.sendEmail(mockEmailDto, ''))
        .rejects.toThrow('Feedback ID is required');

      expect(repository.findOneBy).not.toHaveBeenCalled();
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when feedback not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.sendEmail(mockEmailDto, 'feedback123'))
        .rejects.toThrow('Feedback not found');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'feedback123' });
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockFeedbackEntity);
      mockRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(service.sendEmail(mockEmailDto, 'feedback123'))
        .rejects.toThrow('Database error');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'feedback123' });
      expect(repository.update).toHaveBeenCalledWith('feedback123', mockEmailDto);
    });
  });
});
