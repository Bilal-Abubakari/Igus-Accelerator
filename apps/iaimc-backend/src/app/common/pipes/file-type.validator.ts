import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MulterFile } from '../types/file.types';

@Injectable()
export class FileTypeValidatorPipe implements PipeTransform {
  constructor(private readonly acceptableFileTypes: string[]) {}

  public transform(file: MulterFile): MulterFile {
    if (!file) throw new BadRequestException('No file was uploaded');

    const fileType = file.originalname.split('.')[1];

    if (!this.acceptableFileTypes.includes(fileType))
      throw new BadRequestException('Invalid file type');
    else return file;
  }
}
