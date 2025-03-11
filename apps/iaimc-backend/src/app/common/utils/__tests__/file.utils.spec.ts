import { Logger } from '@nestjs/common';
import { existsSync, readFileSync, writeFile, writeFileSync } from 'fs';
import XLSX from 'xlsx';
import {
  checkFileExistence,
  getFileExtension,
  readFileContents,
  saveFile,
} from '../file.utils';
import { customLogger, convertXLSXToCSV } from '../general.utils';

jest.mock('fs');

jest.mock('xlsx', () => ({
  readFile: jest.fn(),
  utils: {
    sheet_to_csv: jest.fn(),
  },
}));

const loggerSpyLog = jest.spyOn(Logger.prototype, 'log');
const loggerSpyWarn = jest.spyOn(Logger.prototype, 'warn');
const loggerSpyError = jest.spyOn(Logger.prototype, 'error');
const loggerSpyDebug = jest.spyOn(Logger.prototype, 'debug');

describe('Utility functions', () => {
  const filePath = 'some/file/path';
  const fileContents = 'testing 😔';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Check file existence', () => {
    it('should return false if file path does not exist', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      const fileExists = checkFileExistence(filePath);
      expect(fileExists).toBe(false);
      expect(existsSync).toHaveBeenCalled();
    });

    it('should return true if file path exist', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      const fileExists = checkFileExistence(filePath);
      expect(fileExists).toBe(true);
    });
  });

  describe('Check file content', () => {
    it('should read file content if path is valid', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (readFileSync as jest.Mock).mockReturnValue(fileContents);

      expect(readFileContents(filePath)).toBe(fileContents);
    });

    it('should return undefined if path is invalid', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      expect(readFileContents(filePath)).toBeUndefined();
    });
  });

  describe('Save file', () => {
    it('should save string content to a file', () => {
      (writeFile as unknown as jest.Mock).mockImplementation(
        (path, content, callback) => {
          callback(null);
        },
      );

      saveFile(filePath, fileContents);

      expect(writeFileSync).toHaveBeenCalledWith(filePath, fileContents, {
        encoding: 'utf-8',
      });
    });
  });

  describe('Custom logger', () => {
    const scope = 'test scope';

    it('should log a debug message', () => {
      customLogger('debug message', scope, 'debug');
      expect(loggerSpyDebug).toHaveBeenCalled();
    });

    it('should log a error message', () => {
      customLogger('error message', scope, 'error');
      expect(loggerSpyError).toHaveBeenCalled();
    });

    it('should log a warn message', () => {
      customLogger('warn message', scope, 'warn');
      expect(loggerSpyWarn).toHaveBeenCalled();
    });

    it('should log a log message', () => {
      customLogger('log message', scope, 'log');
      expect(loggerSpyLog).toHaveBeenCalled();
    });
  });

  describe('convert XLSX to csv', () => {
    const mockPath = 'path/to/mock/file.xlsx';

    it('should convert an XLSX file to csv', () => {
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };
      const mockCSV = 'mock,csv,data';

      (XLSX.readFile as jest.Mock).mockReturnValue(mockWorkbook);

      (XLSX.utils.sheet_to_csv as jest.Mock).mockReturnValue(mockCSV);

      const result = convertXLSXToCSV(mockPath);

      expect(XLSX.readFile).toHaveBeenCalledWith(mockPath);
      expect(XLSX.utils.sheet_to_csv).toHaveBeenCalledWith(
        mockWorkbook.Sheets[mockWorkbook.SheetNames[0]],
      );
      expect(result).toBe(mockCSV);
    });

    it('should handle errors when reading the XLSX file', () => {
      (XLSX.readFile as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to read file');
      });

      expect(() => convertXLSXToCSV(mockPath)).toThrow('Failed to read file');
    });

    it('should handle errors when converting the sheet to CSV', () => {
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      (XLSX.readFile as jest.Mock).mockReturnValue(mockWorkbook);

      (XLSX.utils.sheet_to_csv as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to convert sheet to CSV');
      });

      expect(() => convertXLSXToCSV(mockPath)).toThrow(
        'Failed to convert sheet to CSV',
      );
    });
  });

  describe('Get file extension', () => {
    test('returns the extension for a file with a single dot', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf');
    });

    test('returns the last extension for a file with multiple dots', () => {
      expect(getFileExtension('archive.tar.gz')).toBe('gz');
    });

    test('returns an empty string for a filename ending with a dot', () => {
      expect(getFileExtension('filename.')).toBe('');
    });

    test('returns an empty string for an empty input', () => {
      expect(getFileExtension('')).toBe('');
    });
  });
});
