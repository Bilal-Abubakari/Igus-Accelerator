import { Test, TestingModule } from '@nestjs/testing';
import { NewsLetterSubscriberController } from './news-letter-subscriber.controller';
import { NewsLetterSubscriberService } from './news-letter-subscriber.service';
import { NewsLetterSubscriberDto } from './dtos/news-letter-subscriber.dto';

describe('NewsLetterSubscriberController', () => {
  let controller: NewsLetterSubscriberController;
  let serviceMock: {
    create: jest.Mock<Promise<void>, [NewsLetterSubscriberDto]>;
  };

  const mockSubscriberDto: NewsLetterSubscriberDto = {
    email: 'test@example.com',
    firstName: 'John',
  };

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsLetterSubscriberController],
      providers: [
        {
          provide: NewsLetterSubscriberService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<NewsLetterSubscriberController>(
      NewsLetterSubscriberController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with the provided DTO', async () => {
      serviceMock.create.mockResolvedValue();

      await controller.create(mockSubscriberDto);

      expect(serviceMock.create).toHaveBeenCalledWith(mockSubscriberDto);
      expect(serviceMock.create).toHaveBeenCalledTimes(1);
    });

    it('should return the result from service.create', async () => {
      serviceMock.create.mockResolvedValue();

      const result = await controller.create(mockSubscriberDto);

      expect(result).toBeUndefined();
    });

    it('should propagate errors from the service', async () => {
      const error = new Error('Service error');
      serviceMock.create.mockRejectedValue(error);

      await expect(controller.create(mockSubscriberDto)).rejects.toThrow(error);
    });
  });
});
