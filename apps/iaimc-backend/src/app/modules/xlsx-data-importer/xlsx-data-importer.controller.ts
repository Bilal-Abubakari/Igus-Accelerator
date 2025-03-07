import { Body, Controller, Post } from '@nestjs/common';
import { ResponseObject } from '../../common/types';
import { MaterialsDataImportDto } from './dtos/materials-data-import.dto';
import { XLSXDataImporterService } from './xlsx-data-importer.service';

@Controller('data-import')
export class XLSXDataImporterController {
  constructor(
    private readonly xlsxDataImporterService: XLSXDataImporterService,
  ) {}

  @Post('materials')
  private convertMaterialCSVToJson(
    @Body() { file, outputFile }: MaterialsDataImportDto,
  ): ResponseObject {
    return this.xlsxDataImporterService.importMaterialsXLSXDataToJson(
      file,
      outputFile,
    );
  }
}
