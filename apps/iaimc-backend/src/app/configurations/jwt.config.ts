import { JwtModuleOptions } from '@nestjs/jwt';
import { JwtConfig } from '../common/types/general.types';

export default (): JwtConfig => ({
  jwtOptions: {
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    },
  } satisfies JwtModuleOptions,
});
