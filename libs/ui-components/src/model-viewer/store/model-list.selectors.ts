import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  modelListAdapter,
  ModelListState,
  MODEL_LIST_FEATURE_KEY,
} from './model-list.state';

export const selectModelListState = createFeatureSelector<ModelListState>(
  MODEL_LIST_FEATURE_KEY,
);

export const {
  selectAll: selectAllModels,
  selectEntities: selectModelEntities,
  selectIds: selectModelIds,
} = modelListAdapter.getSelectors(selectModelListState);

export const selectTriggerModelFetch = createSelector(
  selectModelListState,
  (state) => state.triggerModelFetch,
);

export const selectErrorFetchingModel = createSelector(
  selectModelListState,
  (state) => state.errorFetchingModel,
);
