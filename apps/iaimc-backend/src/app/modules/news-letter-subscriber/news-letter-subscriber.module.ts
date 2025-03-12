import { Module } from '@nestjs/common';
import { NewsLetterSubscriberController } from './news-letter-subscriber.controller';
import { NewsLetterSubscriberService } from './news-letter-subscriber.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetterSubscriberEntity } from './entities/new-letter-subscriber.entity';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsLetterSubscriberEntity
    ]),
    NestMailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  controllers: [NewsLetterSubscriberController],
  providers: [NewsLetterSubscriberService]
})
export class NewsLetterSubscriberModule {}
