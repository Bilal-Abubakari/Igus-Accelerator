import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { Readable } from 'typeorm/platform/PlatformTools';
import {
  FileStoreDirectory,
  MulterFile,
  ResponseObject,
} from '../../common/types';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger();

  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  public async uploadFile(
    file: MulterFile,
    directory: FileStoreDirectory,
  ): Promise<ResponseObject<unknown>> {
    const uploadApiOptions = {
      folder: directory,
      resource_type: 'raw',
      public_id: `${file.originalname}`,
      use_filename: true,
      unique_filename: false,
    } satisfies UploadApiOptions;

    const upload = new Promise((resolve, rejects) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadApiOptions,
        (error, result) => {
          if (error) rejects(new Error(error.message));
          else resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });

    try {
      const results = await upload;
      return { data: results };
    } catch (error: unknown) {
      this.logger.error(`File upload failed: ${(error as Error).message}`);
      throw new InternalServerErrorException('Could not upload file');
    }
  }
}
