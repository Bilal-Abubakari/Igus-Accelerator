import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { AvailableLangs, provideTransloco } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';
import {
  localStorageStrategy,
  providePersistStore,
} from '@ngrx-addons/persist-state';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  AVAILABLE_LANGUAGE_CODES,
  LANGUAGE_LOCALE_MAPPING,
} from 'libs/ui-components/src/language-switcher/constants';
import { environment } from '../../environments/environment';
import { appRoutes } from './app.routes';
import { PrebuiltTranslocoLoader } from './transloco-loader';
import { excludeKeys } from '@ngrx-addons/common';
import { MAIN_FOOTER_FEATURE_KEY } from '../../../../libs/ui-components/src/model/components/main-footer/store/footer.reducer';
import { appReducer } from './app.reducer';
import { appEffects } from './app.effects';
import { CONTACT_FORM_FEATURE_KEY } from 'libs/ui-components/src/contact-form/store/reducer/contact-form.reducer';
import { NEWS_LETTER_SUBSCRIBER_FEATURE_KEY } from 'libs/ui-components/src/landing-page/footer/store/footer.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(appReducer),
    provideEffects(...appEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    providePersistStore({
      states: [
        {
          key: MAIN_FOOTER_FEATURE_KEY,
          storage: localStorageStrategy,
          runGuard: () => typeof window !== 'undefined',
          migrations: [],
          source: (state) =>
            state.pipe(
              excludeKeys([
                'isEmailUpdated',
                'isFeedbackSubmitted',
                'message',
                'isFeedbackLoading',
                'isFeedbackSubmitted',
              ]),
            ),
          skip: 1,
        },
        {
          key: CONTACT_FORM_FEATURE_KEY,
          storage: localStorageStrategy,
          runGuard: () => typeof window !== 'undefined',
          migrations: [],
          source: (state) =>
            state.pipe(excludeKeys(['isSubmitting', 'isSubmitted', 'error'])),
          skip: 1,
        },
        {
          key: NEWS_LETTER_SUBSCRIBER_FEATURE_KEY,
          storage: localStorageStrategy,
          runGuard: () => typeof window !== 'undefined',
          migrations: [],
          source: (state) =>
            state.pipe(excludeKeys(['isSubscriptionLoading', 'message'])),
          skip: 1,
        },
      ],
    }),
    provideRouterStore(),
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    provideHttpClient(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGUAGE_CODES as unknown as AvailableLangs,
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: PrebuiltTranslocoLoader,
    }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true },
    },
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
