import path from 'path';

export const MAX_STEP_FILE_SIZE_MB = 50 * 1024 * 1024; // 50mb

export const ALLOWED_MODEL_MIME_TYPES = ['stl'];

export const XLSX_ASSETS_FOLDER = path.join(__dirname, 'assets/data/xlsx');
export const JSON_ASSETS_FOLDER = path.join(__dirname, 'assets/data/json');
