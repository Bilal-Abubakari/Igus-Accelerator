import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MulterFile } from '../types';

@Injectable()
export class FileSizeValidatorPipe implements PipeTransform {
  constructor(private readonly maxFileSize: number) {}

  public transform(file: MulterFile): MulterFile {
    if (!file) throw new BadRequestException('No file was uploaded');
    else if (file.size > this.maxFileSize)
      throw new BadRequestException(
        `File size is too large. Max allowed is ${this.maxFileSize}`,
      );
    else return file;
  }
}
