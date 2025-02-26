import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ALLOWED_MODEL_MIME_TYPES,
  MAX_STEP_FILE_SIZE_MB,
} from '../../common/constants';
import { FileSizeValidatorPipe } from '../../common/pipes/file-size.validator';
import { FileTypeValidatorPipe } from '../../common/pipes/file-type.validator';
import { MulterFile, ResponseObject } from '../../common/types';
import { FileStoreUploadDto } from './dtos/file-upload.dto';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  private uploadFile(
    @UploadedFile(
      new FileSizeValidatorPipe(MAX_STEP_FILE_SIZE_MB),
      new FileTypeValidatorPipe(ALLOWED_MODEL_MIME_TYPES),
    )
    file: MulterFile,
    @Body(ValidationPipe) {directory}: FileStoreUploadDto,
  ): Promise<ResponseObject> {
    return this.fileUploadService.uploadFile(file, body.directory);
  }
}
