import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from '../service/feedback.service';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { EmailDto } from '../dtos/email.dto';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let feedbackService: FeedbackService;

  const mockCreateFeedbackDto: CreateFeedbackDto = {
    comment: 'Test feedback',
    rating: 5,
  };

  const mockEmailDto: EmailDto = {
    email: 'test@example.com',
  };

  const mockFeedbackService = {
    createFeedback: jest.fn(),
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: mockFeedbackService,
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    feedbackService = module.get<FeedbackService>(FeedbackService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('create', () => {
    it('should call feedbackService.createFeedback with correct parameters', async () => {
      const mockResponse = { id: 'feedback123' };
      mockFeedbackService.createFeedback.mockResolvedValue(mockResponse);
      const result = await controller.create(mockCreateFeedbackDto);
      expect(feedbackService.createFeedback).toHaveBeenCalledTimes(1);
      expect(feedbackService.createFeedback).toHaveBeenCalledWith(mockCreateFeedbackDto);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from feedbackService.createFeedback', async () => {
      const error = new Error('Service error');
      mockFeedbackService.createFeedback.mockRejectedValue(error);
      await expect(controller.create(mockCreateFeedbackDto)).rejects.toThrow(error);
    });
  });

  describe('sendEmail', () => {
    it('should call feedbackService.sendEmail with correct parameters', async () => {
      mockFeedbackService.sendEmail.mockResolvedValue(undefined);
      await controller.sendEmail(mockEmailDto, 'feedback123');
      expect(feedbackService.sendEmail).toHaveBeenCalledTimes(1);
      expect(feedbackService.sendEmail).toHaveBeenCalledWith(mockEmailDto, 'feedback123');
    });

    it('should handle errors from feedbackService.sendEmail', async () => {
      const error = new Error('Service error');
      mockFeedbackService.sendEmail.mockRejectedValue(error);
      await expect(controller.sendEmail(mockEmailDto, 'feedback123')).rejects.toThrow(error);
    });
  });
});
