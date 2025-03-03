import { Language, LanguageCode } from './types';

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const AVAILABLE_LANGUAGE_CODES = [
  'en', // English
  'es', // Spanish
  'zh', // Chinese
  'de', // German
  'ar', // Arabic
  'pt', // Portuguese
  'ru', // Russian
  'jp', // Japanese
  'fr', // French
] as const;

export const LANGUAGE_LOCALE_MAPPING = {
  en: 'en-US', // English (United States)
  es: 'es-ES', // Spanish (Spain)
  zh: 'zh-CN', // Chinese, simplified (China)
  de: 'de-DE', // German (Germany)
  ar: 'ar-SA', // Arabic (Saudi Arabia)
  pt: 'pt-BR', // Portuguese (Brazil)
  ru: 'ru-RU', // Russian (Russia)
  ja: 'ja-JP', // Japanese (Japan)
  fr: 'fr-FR', // French (France)
};

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'United States (English)',
  es: 'Spain (Spanish)',
  zh: 'China (Chinese)',
  de: 'Germany (German)',
  ar: 'Saudi Arabia (Arabic)',
  pt: 'Brazil (Portuguese)',
  ru: 'Russia (Russian)',
  jp: 'Japan (Japanese)',
  fr: 'France (French)',
};

export const AVAILABLE_LANGUAGES: Language[] = AVAILABLE_LANGUAGE_CODES.map(
  (code) => ({
    label: LANGUAGE_LABELS[code],
    code,
    flag: `/assets/flags/${code}.svg`,
  }),
);
