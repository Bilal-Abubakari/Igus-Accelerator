import { AVAILABLE_LANGUAGE_CODES } from './constants';

export type LanguageCode = (typeof AVAILABLE_LANGUAGE_CODES)[number];

export interface Language {
  label: string;
  code: LanguageCode;
  flag: string;
}
