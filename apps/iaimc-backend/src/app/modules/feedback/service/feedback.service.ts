import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailDto } from '../dtos/email.dto';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { FeedbackEntity } from '../feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  public async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<{ id: string }> {
    try {
      const feedback = this.feedbackRepository.create(createFeedbackDto);
      const savedFeedback = await this.feedbackRepository.save(feedback);
      return { id: savedFeedback.id };
    } catch {
      throw new InternalServerErrorException('Failed to create feedback');
    }
  }

  public async sendEmail(
    emailDto: EmailDto,
    feedbackId: string,
  ): Promise<void> {
    try {
      if (!feedbackId) {
        throw new InternalServerErrorException('Feedback ID is required');
      }
      const feedback = await this.feedbackRepository.findOneBy({
        id: feedbackId,
      });
      if (!feedback) {
        throw new InternalServerErrorException('Feedback not found');
      }
      await this.feedbackRepository.update(feedbackId, emailDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Failed to send email',
        );
      }
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
