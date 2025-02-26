import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { appRoutes } from './app.routes';
import { ModelsEffects } from './customer/store/model-upload/model-upload.effects';
import { modelsReducer } from './customer/store/model-upload/model-upload.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideStore({ modelUpload: modelsReducer }),
    provideEffects(ModelsEffects),
  ],
};
