import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import * as feedbackTranslations from './../../public/i18n/feedback.i18n.json';
import * as footerTranslations from './../../public/i18n/footer.i18n.json';
import * as langSwitcherTranslations from './../../public/i18n/lang-switcher.i18n.json';
import * as stageTranslations from './../../public/i18n/stage.i18n.json';
import * as toolbarTranslations from './../../public/i18n/toolbar.i18n.json';

const componentTranslations = {
  stage: stageTranslations,
  toolbar: toolbarTranslations,
  'lang-switcher': langSwitcherTranslations,
  feedback: feedbackTranslations,
  footer: footerTranslations,
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
