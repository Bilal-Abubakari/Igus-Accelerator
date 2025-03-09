import { JwtModuleOptions } from '@nestjs/jwt';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface ResponseObject<T = undefined> {
  message?: string;
  data?: T;
}

export type DatabaseConfig = {
  database: TypeOrmModuleOptions;
};

export type JwtConfig = {
  jwtOptions: JwtModuleOptions;
};

export type ThrottlerConfig = {
  throttlerOptions: ThrottlerModuleOptions;
};

export type LOGGER_TYPE = 'log' | 'warn' | 'error' | 'debug';

export enum ReviewStatus {
  Unsubmitted = 'Unsubmitted',
  Unassigned = 'Unassigned',
  Assigned = 'Assigned',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum Role {
  Admin = 'Admin',
  Customer = 'Customer',
}

export type JwtUserPayload = {
  id: string;
  anonymous: boolean;
};
