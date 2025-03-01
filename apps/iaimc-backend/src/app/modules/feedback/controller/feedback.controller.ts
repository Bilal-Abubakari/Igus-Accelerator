import { Body, Controller, Post, Put, Session } from '@nestjs/common';
import { EmailDto } from '../dtos/email.dto';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { SessionModel } from '../feedback.model';
import { FeedbackService } from '../service/feedback.service';

@Controller('user-feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  public async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Session() session: SessionModel,
  ): Promise<void> {
    return this.feedbackService.createFeedback(createFeedbackDto, session);
  }

  @Put()
  public async sendEmail(
    @Body() emailDto: EmailDto,
    @Session() session: SessionModel,
  ): Promise<void> {
    return this.feedbackService.sendEmail(emailDto, session);
  }
}
