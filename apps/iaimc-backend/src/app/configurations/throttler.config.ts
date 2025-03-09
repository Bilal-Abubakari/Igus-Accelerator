import { minutes, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ThrottlerConfig } from '../common/types/general.types';

export default (): ThrottlerConfig => ({
  throttlerOptions: {
    throttlers: [
      {
        ttl: minutes(1),
        limit: 10,
      },
    ],
  } satisfies ThrottlerModuleOptions,
});
