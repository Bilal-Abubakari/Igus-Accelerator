import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Model } from './model-upload.state';

export const ModelsActions = createActionGroup({
  source: 'Models',
  events: {
    'Upload Model': props<{ file: File }>(),
    'Upload Model Success': props<{ model: Model }>(),
    'Upload Model Failure': props<{ error: string }>(),

    'Load Models': emptyProps(),
    'Load Models Success': props<{ models: Model[] }>(),
    'Load Models Failure': props<{ error: string }>(),
  },
});
