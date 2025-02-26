import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../common/types';

export default (): DatabaseConfig => ({
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [],
    url: process.env.POSTGRES_DATABASE_URL,
    synchronize: process.env.NODE_ENV === 'development',
  } satisfies TypeOrmModuleOptions,
});
