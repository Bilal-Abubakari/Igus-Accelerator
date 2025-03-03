import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { EmailDto } from '../dtos/email.dto';
import { CreateFeedbackDto } from '../dtos/feedback.dto';
import { FeedbackService } from '../service/feedback.service';

@Controller('user-feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  public async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<{ id: string }> {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Patch(':id')
  public async sendEmail(
    @Body() emailDto: EmailDto,
    @Param('id') feedbackId: string,
  ): Promise<void> {
    return this.feedbackService.sendEmail(emailDto, feedbackId);
  }
}
