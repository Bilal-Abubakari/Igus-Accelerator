import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { createActionGroup, props, emptyProps } from '@ngrx/store';

export const MaterialActions = createActionGroup({
  source: 'Material',
  events: {
    'Load Materials': emptyProps(),
    'Load Materials Success': props<{
      materials: InjectionMoldingMaterial[];
    }>(),
    'Load Materials Failure': props<{ materialFetchError: string }>(),
    'Toggle Material Selection': props<{ materialId: string; colorHex: string }>(),
  },
});
