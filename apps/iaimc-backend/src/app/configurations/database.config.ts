import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RoleEntity } from '../common/entities/role.entity';
import { UserEntity } from '../common/entities/user.entity';
import { DatabaseConfig } from '../common/types/general.types';
import { FeedbackEntity } from '../modules/feedback/feedback.entity';
import { ModelConfigurationEntity } from '../modules/model-configurations/entities/configuration.entity';
import { FileEntity } from '../modules/model-configurations/entities/file.entity';

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
      FileEntity,
      ModelConfigurationEntity,
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
