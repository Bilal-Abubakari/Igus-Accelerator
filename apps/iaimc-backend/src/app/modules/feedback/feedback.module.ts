import { Module } from '@nestjs/common';
import { FeedbackController } from './controller/feedback.controller';
import { FeedbackService } from './service/feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from './feedback.entity';

@Module({
  controllers: [FeedbackController],
  imports: [TypeOrmModule.forFeature([FeedbackEntity])],
  providers: [FeedbackService],
})
export class FeedbackModule {}
