import { IsEnum } from 'class-validator';
import { FileStoreDirectory } from '../../../common/types';

export class FileStoreUploadDto {
  @IsEnum(FileStoreDirectory, {
    message: `Invalid directory. Must be one of: [${Object.values(FileStoreDirectory).join(', ')}]`,
  })
  public directory!: FileStoreDirectory;
}
