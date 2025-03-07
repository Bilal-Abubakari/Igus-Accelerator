import { Logger } from '@nestjs/common';
import { existsSync, readFileSync, writeFile } from 'fs';
import { LOGGER_TYPE } from '../types';
import XLSX from 'xlsx';

const logger = new Logger();

const LOGGER_SCOPE = 'helpers';

/**
 * Accepts the path to a file or directory and returns true if it exists.
 * Accepts an optional file name for
 * @param path
 * @returns boolean
 */
export function checkFileExistence(path: string): boolean {
  const fileExists = existsSync(path);

  if (!fileExists) {
    const errorMessage = 'File does not exist';
    customLogger(`${errorMessage}: ${path}`, LOGGER_SCOPE, 'error');
    return false;
  }

  return true;
}

/**
 * Reads the file contents at the specified path
 * @param path
 * @returns
 */
export function readFileContents(path: string): string | undefined {
  const fileExists = checkFileExistence(path);

  if (!fileExists) {
    const errorMessage = 'Could not read file at the given path';
    customLogger(`${errorMessage}: ${path}`, LOGGER_SCOPE, 'error');
    return;
  }

  return readFileSync(path, { encoding: 'utf-8' });
}

export function convertXLSXToCSV(path: string): string {
  const workbook = XLSX.readFile(path);
  return XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
}

/**
 * Write the provided contents to the specified path
 * @param path
 * @param contents
 */
export function saveFile(path: string, contents: string | object): void {
  if (contents !== null && typeof contents === 'object')
    contents = JSON.stringify(contents, null, 2);
  writeFile(path, contents, (error) => {
    if (error) customLogger(error.message, LOGGER_SCOPE);
  });
}

export function customLogger(
  message: string,
  scope?: string,
  type: LOGGER_TYPE = 'error',
): void {
  switch (type) {
    case 'debug':
      logger.debug(`${scope}: ${message}`);
      break;
    case 'error':
      logger.error(`${scope}: ${message}`);
      break;
    case 'warn':
      logger.warn(`${scope}: ${message}`);
      break;
    default:
      logger.log(`${scope}: ${message}`);
  }
}
