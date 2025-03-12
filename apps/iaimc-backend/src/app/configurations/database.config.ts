import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../common/types/general.types';
import { FeedbackEntity } from '../modules/feedback/feedback.entity';
import { ModelConfigurationEntity, UserEntity, FileEntity, RoleEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { ContactFormEntity } from '../modules/contact-form/entity/contact-form.entity';
import { NewsLetterSubscriberEntity } from '../modules/news-letter-subscriber/entities/new-letter-subscriber.entity';

export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
      FeedbackEntity,
      ContactFormEntity,
      FileEntity,
      ModelConfigurationEntity,
      NewsLetterSubscriberEntity,
      RoleEntity,
      UserEntity,
    ],
    url: process.env.POSTGRES_DATABASE_URL,
    synchronize: process.env.NODE_ENV === 'development',
    ssl: false,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  } satisfies TypeOrmModuleOptions,
});
