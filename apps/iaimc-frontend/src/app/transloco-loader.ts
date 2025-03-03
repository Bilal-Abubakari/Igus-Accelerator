import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

import {
  toolbarI18n,
  langSwticherI18n,
  feedBackI18n,
  modelListI18n,
  modelUploadI18n,
  stageI18n,
  footerI18n,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

const componentTranslations = {
  stage: stageI18n,
  toolbar: toolbarI18n,
  'lang-switcher': langSwticherI18n,
  feedback: feedBackI18n,
  footer: footerI18n,
  'model-list': modelListI18n,
  'model-upload': modelUploadI18n,
};

@Injectable({ providedIn: 'root' })
export class PrebuiltTranslocoLoader implements TranslocoLoader {
  private readonly translationCache: Record<string, Translation> = {};

  public getTranslation(lang: string): Observable<Translation> {
    if (this.translationCache[lang]) {
      return of(this.translationCache[lang]);
    }

    const result: Translation = {};

    Object.entries(componentTranslations).forEach(([_, translations]) => {
      this.extractTranslationsForLang(translations, lang, result);
    });

    this.translationCache[lang] = result;

    return of(result);
  }

  private extractTranslationsForLang(
    componentTranslation: object,
    lang: string,
    result: Translation,
    prefix = '',
  ): void {
    Object.entries(componentTranslation).forEach(([key, value]) => {
      const currentPath = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        // If it's an object with language keys...
        if (lang in value) {
          result[currentPath] = value[lang];
        } else {
          // If it's a nested object, recurse deeper
          this.extractTranslationsForLang(value, lang, result, currentPath);
        }
      }
    });
  }
}
