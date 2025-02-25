import { ConfigModuleOptions } from '@nestjs/config';
import databaseConfig from './database.config';

export default {
  isGlobal: true,
  load: [databaseConfig],
} satisfies ConfigModuleOptions;
