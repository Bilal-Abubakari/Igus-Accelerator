import { Logger } from '@nestjs/common';
import XLSX from 'xlsx';
import { LOGGER_TYPE } from '../types/general.types';

const logger = new Logger();

export function convertXLSXToCSV(path: string): string {
  const workbook = XLSX.readFile(path);
  return XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
}

export function customLogger(
  message: string,
  scope: string,
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
