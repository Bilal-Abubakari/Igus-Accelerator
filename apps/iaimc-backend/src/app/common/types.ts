import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

export enum FileStoreDirectory {
  MODELS = 'models',
  CONTACT_FORMS = 'contact_forms',
}

export type DatabaseConfig = {
  database: TypeOrmModuleOptions;
};

export type MulterFile = Express.Multer.File;

export interface ResponseObject<T = undefined> {
  message?: string;
  data?: T;
}
