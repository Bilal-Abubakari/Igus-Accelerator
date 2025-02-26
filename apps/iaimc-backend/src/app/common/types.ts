import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
