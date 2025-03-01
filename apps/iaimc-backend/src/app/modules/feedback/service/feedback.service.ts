import {
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailDto } from '../dtos/email.dto';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { FeedbackEntity } from '../feedback.entity';
import { SessionModel } from '../feedback.model';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  public async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
    session: SessionModel
  ): Promise<void> {
    try {
      const feedback = this.feedbackRepository.create(createFeedbackDto);
      const savedFeedback = await this.feedbackRepository.save(feedback);
      session.feedbackId = savedFeedback.id;

    } catch  {
      throw new InternalServerErrorException('Failed to create feedback');
    }
  }

  public async sendEmail(emailDto: EmailDto, session: SessionModel): Promise<void> {
    try {
      const feedbackId = session.feedbackId; 
      if (!feedbackId) {
        throw new InternalServerErrorException('No feedback  found ');
      }
      const feedback = await this.feedbackRepository.findOneBy({ id: feedbackId });
      if (!feedback) {
        throw new InternalServerErrorException('Feedback not found');
      }
      await this.feedbackRepository.update(feedbackId, emailDto);
    } catch {
      throw new InternalServerErrorException('Failed to send email');
    }
  }

}
