import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ModelsState, adapter } from './model-upload.state';

export const selectModelsState = createFeatureSelector<ModelsState>('models');

const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

export const selectAllModels = createSelector(selectModelsState, selectAll);
export const selectModelEntities = createSelector(
  selectModelsState,
  selectEntities,
);
export const selectTotalModels = createSelector(selectModelsState, selectTotal);
export const selectLoading = createSelector(
  selectModelsState,
  (state) => state.loading,
);
export const selectError = createSelector(
  selectModelsState,
  (state) => state.error,
);
