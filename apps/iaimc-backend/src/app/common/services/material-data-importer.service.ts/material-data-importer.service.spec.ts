import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fileUtilHelpers from '../../utils/file.utils';
import * as generalUtilHelpers from '../../utils/general.utils';
import {
  JSON_ASSETS_FOLDER,
  MaterialDataImporterService,
} from './material-data-importer.service';

jest.mock('../../utils/file.utils');
jest.mock('../../utils/general.utils');

jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
}));

describe('Materials Data Importer Service', () => {
  let service: MaterialDataImporterService;

  const csvFileName = 'materials.csv';
  const jsonFileName = 'materials.json';
  const jsonFilePath = `${JSON_ASSETS_FOLDER}/${jsonFileName}`;
  const successfulImportMessage = 'Materials data successfully imported';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialDataImporterService],
    }).compile();

    service = module.get<MaterialDataImporterService>(
      MaterialDataImporterService,
    );

    jest.clearAllMocks();
  });

  const setupMocks = (options: {
    fileExists?: boolean;
    fileContent?: string;
    csvData?: string;
    existingJsonData?: object[];
  }): void => {
    (fileUtilHelpers.checkFileExistence as jest.Mock).mockReturnValue(
      options.fileExists ?? true,
    );
    (fileUtilHelpers.readFileContents as jest.Mock).mockReturnValue(
      options.fileContent ?? JSON.stringify(options.existingJsonData ?? []),
    );
    (generalUtilHelpers.convertXLSXToCSV as jest.Mock).mockReturnValue(
      options.csvData ?? '',
    );
  };

  describe('Import materials XLSX data to json', () => {
    it('should throw an exception if the csv file does not exist', () => {
      setupMocks({ fileExists: false });

      expect(() => {
        service.importMaterialsXLSXDataToJson(csvFileName);
      }).toThrow();
    });

    it('should throw an exception if the csv file cannot be read', () => {
      setupMocks({ fileContent: undefined });

      expect(() => {
        service.importMaterialsXLSXDataToJson(csvFileName);
      }).toThrow(InternalServerErrorException);
    });

    it('should throw an exception if csv content is invalid', () => {
      setupMocks({ csvData: 'id,name,type\n1,Material A' });

      expect(() => {
        service.importMaterialsXLSXDataToJson(csvFileName);
      }).toThrow(InternalServerErrorException);
    });

    it('should successfully import csv data and merge with existing JSON data', () => {
      const csvData = `id,name,type\n1,Material A,Type A\n2,Material B,Type B`;
      const existingJsonData = [{ id: 1, name: 'Material A', type: 'Type A' }];
      const expectedMergedData = [
        { id: 1, name: 'Material A', type: 'Type A' },
        { id: 2, name: 'Material B', type: 'Type B' },
      ];

      setupMocks({ csvData, existingJsonData });

      (fileUtilHelpers.saveFile as jest.Mock).mockImplementation(
        (path, data) => {
          expect(data).toEqual(expectedMergedData);
        },
      );

      const result = service.importMaterialsXLSXDataToJson(csvFileName);

      expect(result).toEqual({
        message: successfulImportMessage,
      });
      expect(fileUtilHelpers.saveFile).toHaveBeenCalledWith(
        jsonFilePath,
        expectedMergedData,
      );
    });

    it('should throw an exception if csv data is empty', () => {
      setupMocks({ csvData: '' });

      expect(() => {
        service.importMaterialsXLSXDataToJson(csvFileName);
      }).toThrow(InternalServerErrorException);
    });

    it('should handle missing JSON file and create a new one', () => {
      const csvData = `id,name,type\n1,Material A,Type A`;
      const expectedData = [{ id: 1, name: 'Material A', type: 'Type A' }];

      setupMocks({ csvData, fileExists: false });

      (fileUtilHelpers.saveFile as jest.Mock).mockImplementation(
        (path, data) => {
          expect(data).toEqual(expectedData);
        },
      );

      const result = service.importMaterialsXLSXDataToJson(csvFileName);

      expect(result).toEqual({
        message: successfulImportMessage,
      });
      expect(fileUtilHelpers.saveFile).toHaveBeenCalledWith(
        jsonFilePath,
        expectedData,
      );
    });

    it('should handle merging data with duplicate IDs', () => {
      const csvData = `id,name,type\n1,Material A,Type A`;
      const existingJsonData = [{ id: 1, name: 'Material A', type: 'Type X' }];
      const expectedMergedData = [
        { id: 1, name: 'Material A', type: 'Type A' },
      ];

      setupMocks({ csvData, existingJsonData });

      (fileUtilHelpers.saveFile as jest.Mock).mockImplementation(
        (path, data) => {
          expect(data).toEqual(expectedMergedData);
        },
      );

      const result = service.importMaterialsXLSXDataToJson(csvFileName);

      expect(result).toEqual({
        message: successfulImportMessage,
      });
      expect(fileUtilHelpers.saveFile).toHaveBeenCalledWith(
        jsonFilePath,
        expectedMergedData,
      );
    });

    it('should handle the `chemicals` field in csv data', () => {
      const csvData = `id,name,chemicals\n1,Material A,chem1:+,chem2:-`;
      const expectedData = [
        {
          id: 1,
          name: 'Material A',
          chemicals: [
            { name: 'chem1', resistance: '+' },
            { name: 'chem2', resistance: '-' },
          ],
        },
      ];

      setupMocks({ csvData });

      (fileUtilHelpers.saveFile as jest.Mock).mockImplementation(
        (path, data) => {
          expect(data).toEqual(expectedData);
        },
      );
    });

    it('should throw an exception if csv data has missing fields', () => {
      const csvData = `id,name,type\n1,Material A`;
      const errorMessage = 'Invalid csv contents. Some data fields are missing';

      setupMocks({ csvData });

      const customLoggerSpy = jest.spyOn(generalUtilHelpers, 'customLogger');

      expect(() => {
        service.importMaterialsXLSXDataToJson('materials.csv');
      }).toThrow(InternalServerErrorException);

      expect(customLoggerSpy).toHaveBeenCalledWith(
        errorMessage,
        'Materials Importer Service',
        'error',
      );
    });

    it('should skip empty lines in the CSV data', () => {
      const csvData = `id,name,type\n1,Material A,Type A\n\n2,Material B,Type B`; // Empty line in the middle
      const expectedData = [
        { id: 1, name: 'Material A', type: 'Type A' },
        { id: 2, name: 'Material B', type: 'Type B' },
      ];

      setupMocks({ csvData });

      (fileUtilHelpers.saveFile as jest.Mock).mockImplementation(
        (path, data) => {
          expect(data).toEqual(expectedData);
        },
      );

      const result = service.importMaterialsXLSXDataToJson(csvFileName);

      expect(result).toEqual({
        message: successfulImportMessage,
      });
      expect(fileUtilHelpers.saveFile).toHaveBeenCalledWith(
        jsonFilePath,
        expectedData,
      );
    });

    it('should construct the correct jsonFileName from xlsxFile if jsonOutputFile is not provided', () => {
      const csvData = `id,name,type\n1,Material A,Type A`;
      const expectedData = [{ id: 1, name: 'Material A', type: 'Type A' }];

      setupMocks({ csvData });

      (fileUtilHelpers.saveFile as jest.Mock).mockImplementation(
        (path, data) => {
          expect(data).toEqual(expectedData);
        },
      );

      const result = service.importMaterialsXLSXDataToJson(csvFileName);

      expect(result).toEqual({
        message: successfulImportMessage,
      });
      expect(fileUtilHelpers.saveFile).toHaveBeenCalledWith(
        jsonFilePath,
        expectedData,
      );
    });

    describe('Compose material data', () => {
      it('should correctly parse the "chemicals" field', () => {
        const keys = ['id', 'name', 'chemicals'];
        const values = ['1', 'Material A', 'chem1:high,chem2:low'];

        const result = service['composeMaterialData'](keys, values);

        expect(result).toEqual({
          id: 1,
          name: 'Material A',
          chemicals: [
            { name: 'chem1', resistance: 'high' },
            { name: 'chem2', resistance: 'low' },
          ],
        });
      });

      it('should handle numeric values', () => {
        const keys = ['id', 'name', 'quantity'];
        const values = ['1', 'Material A', '10'];

        const result = service['composeMaterialData'](keys, values);

        expect(result).toEqual({
          id: 1,
          name: 'Material A',
          quantity: 10,
        });
      });

      it('should handle string values', () => {
        const keys = ['id', 'name', 'description'];
        const values = ['1', 'Material A', 'A test material'];

        const result = service['composeMaterialData'](keys, values);

        expect(result).toEqual({
          id: 1,
          name: 'Material A',
          description: 'A test material',
        });
      });

      it('should convert "TRUE" to true and "FALSE" to false', () => {
        const keys = ['id', 'highchemicalresistance'];
        const valuesTrue = ['1', 'TRUE'];
        const valuesFalse = ['1', 'FALSE'];

        const resultTrue = service['composeMaterialData'](keys, valuesTrue);
        const resultFalse = service['composeMaterialData'](keys, valuesFalse);

        expect(resultTrue).toEqual({
          id: 1,
          highchemicalresistance: true,
        });

        expect(resultFalse).toEqual({
          id: 1,
          highchemicalresistance: false,
        });
      });

      it('should convert numeric strings to numbers', () => {
        const keys = ['id', 'quantity'];
        const values = ['1', '10'];

        const result = service['composeMaterialData'](keys, values);

        expect(result).toEqual({
          id: 1,
          quantity: 10,
        });
      });

      it('should not convert non-numeric strings to numbers', () => {
        const keys = ['id', 'description'];
        const values = ['1', 'abc'];

        const result = service['composeMaterialData'](keys, values);

        expect(result).toEqual({
          id: 1,
          description: 'abc',
        });
      });
    });
  });
});
