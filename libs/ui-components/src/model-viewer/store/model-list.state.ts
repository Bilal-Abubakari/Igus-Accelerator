import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';

export const MODEL_LIST_FEATURE_KEY = 'modelList';

export interface ModelListState extends EntityState<ModelConfigurationEntity> {
  triggerModelFetch: boolean;
  errorFetchingModel: string | null;
  loading: boolean;
}

export const modelListAdapter = createEntityAdapter<ModelConfigurationEntity>({
  selectId: (model: ModelConfigurationEntity) => model.id,
});

export const initialModelListState: ModelListState =
  modelListAdapter.getInitialState({
    triggerModelFetch: true,
    errorFetchingModel: null,
    loading: false,
  });
