import { Body, Controller, Post } from '@nestjs/common';
import { NewsLetterSubscriberService } from './news-letter-subscriber.service';
import { NewsLetterSubscriberDto } from './dtos/news-letter-subscriber.dto';

@Controller('subscribe')
export class NewsLetterSubscriberController {
  constructor(
    private readonly newsLetterSubscriberService: NewsLetterSubscriberService,
  ) {}

  @Post()
  public create(@Body() subscriberDto: NewsLetterSubscriberDto): Promise<void> {
    return this.newsLetterSubscriberService.create(subscriberDto);
  }
}
