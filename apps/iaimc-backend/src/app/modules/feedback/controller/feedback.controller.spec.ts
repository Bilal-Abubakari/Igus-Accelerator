
import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from '../service/feedback.service';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { EmailDto } from '../dtos/email.dto';
import { SessionModel } from '../feedback.model';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let feedbackService: FeedbackService;
  const mockCreateFeedbackDto: CreateFeedbackDto = {
    comment: 'Test feedback',
    rating: 5
  };

  const mockEmailDto: EmailDto = {
    email: 'test@example.com'
  };

  const mockSession: SessionModel = {
    feedbackId: 'feedback123'
  };

  const mockFeedbackService = {
    createFeedback: jest.fn(),
    sendEmail: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: mockFeedbackService
        }
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
      mockFeedbackService.createFeedback.mockResolvedValue(undefined);
      await controller.create(mockCreateFeedbackDto, mockSession);
      expect(feedbackService.createFeedback).toHaveBeenCalledTimes(1);
      expect(feedbackService.createFeedback).toHaveBeenCalledWith(
        mockCreateFeedbackDto,
        mockSession
      );
    });

    it('should return the result from feedbackService.createFeedback', async () => {
      mockFeedbackService.createFeedback.mockResolvedValue(undefined);
      const result = await controller.create(mockCreateFeedbackDto, mockSession);
      expect(result).toBeUndefined();
    });

    it('should handle errors from feedbackService.createFeedback', async () => {
      const error = new Error('Service error');
      mockFeedbackService.createFeedback.mockRejectedValue(error);
      await expect(controller.create(mockCreateFeedbackDto, mockSession))
        .rejects
        .toThrow(error);
    });
  });

  describe('sendEmail', () => {
    it('should call feedbackService.sendEmail with correct parameters', async () => {
      mockFeedbackService.sendEmail.mockResolvedValue(undefined);
      await controller.sendEmail(mockEmailDto, mockSession);
      expect(feedbackService.sendEmail).toHaveBeenCalledTimes(1);
      expect(feedbackService.sendEmail).toHaveBeenCalledWith(
        mockEmailDto,
        mockSession
      );
    });

    it('should return the result from feedbackService.sendEmail', async () => {
      mockFeedbackService.sendEmail.mockResolvedValue(undefined);
      const result = await controller.sendEmail(mockEmailDto, mockSession);
      expect(result).toBeUndefined();
    });

    it('should handle errors from feedbackService.sendEmail', async () => {
      const error = new Error('Service error');
      mockFeedbackService.sendEmail.mockRejectedValue(error);
      await expect(controller.sendEmail(mockEmailDto, mockSession))
        .rejects
        .toThrow(error);
    });
  });
});