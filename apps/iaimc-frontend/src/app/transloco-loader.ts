import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  private readonly componentFiles = ['stage', 'toolbar', 'lang-switcher'];

  public getTranslation(lang: string): Observable<Translation> {
    const requests = this.componentFiles.map((component) =>
      this.http.get<Translation>(`/i18n/${component}.i18n.json`),
    );

    // Combine all requests
    return forkJoin(requests).pipe(
      map((responses) => {
        const result: Translation = {};

        responses.forEach((componentTranslation, index) => {
          this.extractTranslationsForLang(componentTranslation, lang, result);
        });

        return result;
      }),
    );
  }

  private extractTranslationsForLang(
    componentTranslation: object,
    lang: string,
    result: Translation,
    prefix = '',
  ): void {
    Object.entries(componentTranslation).forEach(([key, value]) => {
      console.log(componentTranslation);
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
