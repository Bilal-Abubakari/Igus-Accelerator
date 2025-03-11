import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Papa, { ParseResult } from 'papaparse';
import path from 'path';
import { ResponseObject } from '../../types/general.types';
import {
  InjectionMoldingMaterial,
  InjectionMoldingMaterialPropertyValueType,
  ResistanceLevel,
} from '@igus-accelerator-injection-molding-configurator/libs/shared';
import {
  checkFileExistence,
  readFileContents,
  saveFile,
} from '../../utils/file.utils';
import { convertXLSXToCSV, customLogger } from '../../utils/general.utils';

const LOGGER_SCOPE = 'Materials Importer Service';

export const XLSX_ASSETS_FOLDER = path.join(
  __dirname,
  '../../../../assets/data/xlsx',
);
export const JSON_ASSETS_FOLDER = path.join(
  __dirname,
  '../../../../assets/data/json',
);

@Injectable()
export class MaterialDataImporterService {
  /**
   * Loads a provided csv file and converts it to json.
   * If the json file already exists, its updated or modified with the new data.
   * @param xlsxFile
   */
  public importMaterialsXLSXDataToJson(xlsxFile: string): ResponseObject {
    const absoluteXLSXFilePath = path.join(XLSX_ASSETS_FOLDER, xlsxFile);
    checkFileExistence(absoluteXLSXFilePath);

    const csvData = convertXLSXToCSV(absoluteXLSXFilePath);

    if (!csvData)
      throw new InternalServerErrorException('Could not import materials data');

    const lines = csvData.split(/\r?\n/);
    const objectKeys = lines[0].split(',');

    const newMaterialsData: InjectionMoldingMaterial[] = [];

    for (let lineNumber = 1; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];
      if (!line) continue;

      const values = this.splitCSVLine(line);
      // Column and value fields must match
      if (values.length !== objectKeys.length) {
        const errorMessage =
          'Invalid csv contents. Some data fields are missing';
        customLogger(errorMessage, LOGGER_SCOPE, 'error');
        throw new InternalServerErrorException(errorMessage);
      }

      const materialData = this.composeMaterialData(objectKeys, values);
      newMaterialsData.push(
        materialData as unknown as InjectionMoldingMaterial,
      );
    }

    const jsonFileName = xlsxFile.split('.')[0] + '.json';
    const jsonFilePath = path.join(JSON_ASSETS_FOLDER, jsonFileName);

    // Check if json file already exists
    let existingMaterialsData: InjectionMoldingMaterial[] = [];
    if (checkFileExistence(jsonFilePath)) {
      const existingJsonContents = readFileContents(jsonFilePath);
      // If the contents of the existing json is valid...
      if (existingJsonContents)
        existingMaterialsData = JSON.parse(existingJsonContents);
    }

    // Merge new data with existing data without duplications
    const mergedMaterialsData = this.mergeMaterialsData(
      existingMaterialsData,
      newMaterialsData,
    );

    // Save json output
    this.saveJsonOutput(mergedMaterialsData, jsonFileName);

    return {
      message: 'Materials data successfully imported',
    };
  }

  private splitCSVLine(line: string): string[] {
    const result: ParseResult<string[]> = Papa.parse(line, {
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '\\',
    });
    return result.data[0];
  }

  private composeMaterialData(
    keys: string[],
    values: string[],
  ): InjectionMoldingMaterial[] {
    // Using a Record here to allow dynamic property assignment since the keys are not known at compile time.
    const materialData: Record<
      string,
      InjectionMoldingMaterialPropertyValueType
    > = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      // The `chemicals` field is processed differently as it's a comma-separated a list of chemicals.
      if (key === 'chemicals') {
        const chemicals = values[i].split(',').map((chemical) => {
          // The format of each chemical in the list is 'chem_name':'resistance'
          const [name, resistance] = chemical.split(':');
          return {
            name,
            resistance: resistance as ResistanceLevel,
          };
        });

        materialData.chemicals = chemicals;
      } else {
        const value = values[i];

        if (value === 'TRUE' || value === 'FALSE')
          materialData[key] = value === 'TRUE';
        else if (Number(value)) materialData[key] = Number(value);
        else materialData[key] = values[i];
      }
    }

    return materialData as unknown as InjectionMoldingMaterial[];
  }

  private mergeMaterialsData(
    existingData: InjectionMoldingMaterial[],
    newData: InjectionMoldingMaterial[],
  ): InjectionMoldingMaterial[] {
    const mergedData = [...existingData];

    newData.forEach((newItem) => {
      const existingItemIndex = mergedData.findIndex(
        (item) => item.id === newItem.id,
      );
      if (existingItemIndex !== -1) {
        // Update existing item
        mergedData[existingItemIndex] = {
          ...mergedData[existingItemIndex],
          ...newItem,
        };
      } else {
        // Add new item
        mergedData.push(newItem);
      }
    });

    return mergedData;
  }

  private saveJsonOutput(data: object, outputFileName: string): void {
    const savePath = path.join(JSON_ASSETS_FOLDER, outputFileName);
    saveFile(savePath, data);
  }
}
