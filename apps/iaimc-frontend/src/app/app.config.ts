import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { appRoutes } from './app.routes';

import { provideEffects } from '@ngrx/effects';
import { modelsReducer } from './customer/store';
import { ModelEffects } from './customer/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideStore({ models: modelsReducer }),
    provideEffects([ModelEffects]),
  ],
};
