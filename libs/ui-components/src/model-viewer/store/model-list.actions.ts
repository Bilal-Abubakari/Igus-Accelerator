import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';

export const ModelListActions = createActionGroup({
  source: 'ModelList',
  events: {
    'Load ModelList': emptyProps(),
    'Load ModelList Success': props<{
      modelList: ModelConfigurationEntity[];
    }>(),
    'Load ModelList Failure': props<{ errorFetchingModel: string }>(),
    'Add Model': props<{ model: ModelConfigurationEntity }>(),
    'Update Model Snapshot': props<{ id: string; snapshot: string }>(),
    'Update Model Snapshot Success': props<{
      model: ModelConfigurationEntity;
    }>(),
    'Update Model Snapshot Failure': props<{ id: string; error: string }>(),
    'Set Upload Status': props<{ hasModelUploaded: boolean }>()
  },
  
});
