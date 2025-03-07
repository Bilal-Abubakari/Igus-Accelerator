import { Module } from '@nestjs/common';
import { XLSXDataImporterController } from './xlsx-data-importer.controller';
import { XLSXDataImporterService } from './xlsx-data-importer.service';

@Module({
  controllers: [XLSXDataImporterController],
  providers: [XLSXDataImporterService],
})
export class XLSXDataImporterModule {}
