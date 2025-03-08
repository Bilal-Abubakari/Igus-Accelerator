import { existsSync, readFileSync, writeFileSync } from 'fs';
import { customLogger } from './general.utils';

const LOGGER_SCOPE = 'file utils';

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

/**
 * Write the provided contents to the specified path
 * @param path
 * @param contents
 */
export function saveFile(path: string, contents: string | object): void {
  if (typeof contents === 'object') {
    contents = JSON.stringify(contents, null, 2);
  }

  try {
    writeFileSync(path, contents, { encoding: 'utf-8' });
  } catch (error: unknown) {
    customLogger((error as Error).message, LOGGER_SCOPE);
  }
}
