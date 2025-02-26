import { IsString } from 'class-validator';

export class FileStoreUploadDto {
  @IsString()
  public directory!: string;
}
