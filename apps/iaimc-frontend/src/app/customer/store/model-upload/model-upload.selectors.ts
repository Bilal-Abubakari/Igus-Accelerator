import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter, ModelsState } from './model-upload.state';

export const selectModelsState = createFeatureSelector<ModelsState>('models');

const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

export const selectAllModels = createSelector(selectModelsState, selectAll);
export const selectModelEntities = createSelector(
  selectModelsState,
  selectEntities,
);
export const selectTotalModels = createSelector(selectModelsState, selectTotal);
export const selectModelState = createSelector(
  selectModelsState,
  (state) => state.loading,
);
export const selectUploadError = createSelector(
  selectModelsState,
  (state) => state.error,
);
export const selectUploadedModel = createSelector(
  selectModelsState,
  (state) => state.uploadedModel,
);
