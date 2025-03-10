import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Material } from './material.model';

export const MaterialActions = createActionGroup({
  source: 'Material',
  events: {
    'Load Materials': emptyProps(),
    'Load Materials Success': props<{ materials: Material[] }>(),
    'Load Materials Failure': props<{ materialFetchError: string }>(),
    'Toggle Material Selection': props<{ materialId: string }>(),
  },
});
