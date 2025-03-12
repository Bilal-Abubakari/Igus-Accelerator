import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NewsLetterSubscriberEntity } from './entities/new-letter-subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { NewsLetterSubscriberDto } from './dtos/news-letter-subscriber.dto';
import * as process from 'node:process';

@Injectable()
export class NewsLetterSubscriberService {
  constructor(
    @InjectRepository(NewsLetterSubscriberEntity)
    private readonly repository: Repository<NewsLetterSubscriberEntity>,
    private readonly mailerService: MailerService,
  ) {}

  public async create(subscriberDto: NewsLetterSubscriberDto): Promise<void> {
    try {
      const subscriber = await this.saveSubscriber(subscriberDto);
      await this.sendWelcomeEmail(subscriber);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create newsletter subscriber ${(error as Error).message}`,
      );
    }
  }

  private async saveSubscriber(
    subscriberDto: NewsLetterSubscriberDto,
  ): Promise<NewsLetterSubscriberEntity> {
    const existingSubscriber = await this.repository.findOne({
      where: { email: subscriberDto.email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.firstName !== subscriberDto.firstName) {
        existingSubscriber.firstName = subscriberDto.firstName;
        return this.repository.save(existingSubscriber);
      }
      return existingSubscriber;
    }

    const subscriber = this.repository.create(subscriberDto);
    return this.repository.save(subscriber);
  }

  private async sendWelcomeEmail(
    subscriber: NewsLetterSubscriberDto,
  ): Promise<void> {
    const { email, firstName } = subscriber;

    try {
      await this.mailerService.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our Newsletter!',
        html: this.getWelcomeEmailTemplate(firstName),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to send welcome email ${(error as Error).message}`,
      );
    }
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <h1>Hello ${firstName},</h1>
      <p>Thank you for subscribing to our newsletter! We're excited to have you onboard.</p>
      <p>Stay tuned for updates and news!</p>
      <br/>
      <p>Best regards,<br/>The Team</p>
    `;
  }
}
