import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

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

export type DatabaseConfig = {
  database: TypeOrmModuleOptions;
};

export type MulterFile = Express.Multer.File;

export type ResponseObject = {
  statusCode?: number;
  message?: string;
  error?: string;
  data?: unknown;
};
