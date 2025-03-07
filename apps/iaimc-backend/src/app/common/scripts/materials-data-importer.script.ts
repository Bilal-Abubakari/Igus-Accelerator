import { MaterialDataImporterService } from '../services/material-data-importer.service.ts/material-data-importer.service';

function main(): void {
  try {
    const xlsxFile = 'materials.xlsx';
    const importer = new MaterialDataImporterService();
    const result = importer.importMaterialsXLSXDataToJson(xlsxFile);

    console.log(result.message);
    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error importing XLSX data:', error.message);
    } else {
      console.error('Error importing XLSX data:', error);
    }
    process.exit(0);
  }
}

main();
