import { ConfigModuleOptions } from '@nestjs/config';

export default {
  envFilePath: '../../.env',
  isGlobal: true,
  load: [],
} as ConfigModuleOptions;
