import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
import { excludeKeys } from '@ngrx-addons/common';
import {
  localStorageStrategy,
  providePersistStore,
} from '@ngrx-addons/persist-state';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { CONTACT_FORM_FEATURE_KEY } from 'libs/ui-components/src/contact-form/store/contact-form.reducer';
import { FOOTER_FEATURE_KEY } from 'libs/ui-components/src/model/components/main-footer/store/footer.reducer';
import {
  AVAILABLE_LANGUAGE_CODES,
  LANGUAGE_LOCALE_MAPPING,
} from 'libs/ui-components/src/language-switcher/constants';
import { environment } from '../../environments/environment';
import { appEffects } from './app.effects';
import { appReducer } from './app.reducer';
import { appRoutes } from './app.routes';
import { httpReqInterceptor } from './interceptors/http.interceptor';
import { PrebuiltTranslocoLoader } from './transloco-loader';
import { MODEL_LIST_FEATURE_KEY } from 'libs/ui-components/src/model-viewer/store/model-list.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(appReducer),
    provideEffects(...appEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    providePersistStore({
      states: [
        {
          key: FOOTER_FEATURE_KEY,
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
          key: MODEL_LIST_FEATURE_KEY,
          storage: localStorageStrategy,
          runGuard: () => typeof window !== 'undefined',
          migrations: [],
          source: (state) =>
            state.pipe(excludeKeys(['loading', 'errorFetchingModel', 'triggerModelFetch'])),
          skip: 1,
        },
      ],
    }),
    provideRouterStore(),
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    // { provide: HTTP_INTERCEPTORS, useClass: HttpReqInterceptor, multi: true },
    provideHttpClient(withInterceptors([httpReqInterceptor])),
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
