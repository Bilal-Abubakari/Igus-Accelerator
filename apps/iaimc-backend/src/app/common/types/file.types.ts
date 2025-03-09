// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

export enum FileStoreDirectory {
  MODELS = 'models',
  CONTACT_FORMS = 'contact_forms',
}

export type MulterFile = Express.Multer.File;

export enum Accepted3DModelType {
  STL = 'stl',
  STP = 'stp',
  STEP = 'step',
}
