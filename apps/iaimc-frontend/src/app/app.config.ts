import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
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
import { environment } from '../../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },

    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
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
