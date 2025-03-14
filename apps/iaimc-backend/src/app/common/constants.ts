import { minutes } from '@nestjs/throttler';

export const MAX_STEP_FILE_SIZE_MB = 50 * 1024 * 1024; // 50mb

export const ALLOWED_MODEL_MIME_TYPES = ['stl'];

export const ENV = {
  JWT_SECRET: 'JWT_SECRET',
  ACCESS_TOKEN_EXPIRATION_TIME: 'ACCESS_TOKEN_EXPIRATION_TIME',
  REFRESH_TOKEN_EXPIRATION_TIME: 'REFRESH_TOKEN_EXPIRATION_TIME',
} as const;

export const ACCESS_TOKEN_EXPIRATION_TIME = minutes(15);
export const REFRESH_TOKEN_THROTTLE_TTL = minutes(14);
