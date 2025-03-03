import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  AVAILABLE_LANGUAGE_CODES,
  LANGUAGE_LOCALE_MAPPING,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { AvailableLangs, provideTransloco } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import { appRoutes } from './app.routes';
import { PrebuiltTranslocoLoader } from './transloco-loader';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGUAGE_CODES as unknown as AvailableLangs,
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: PrebuiltTranslocoLoader,
    }),
    provideTranslocoPersistLang({
      storage: {
        useValue: localStorage,
      },
    }),
    provideTranslocoLocale({
      langToLocaleMapping: LANGUAGE_LOCALE_MAPPING,
    }),
  ],
};
