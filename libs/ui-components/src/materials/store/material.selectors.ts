import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MATERIAL_FEATURE_KEY } from './material.reducer';
import { MaterialState } from './material.state';

export const selectMaterialState =
  createFeatureSelector<MaterialState>(MATERIAL_FEATURE_KEY);

export const selectAllMaterials = createSelector(
  selectMaterialState,
  (state) => state.materials,
);

export const selectLoading = createSelector(
  selectMaterialState,
  (state) => state.triggerMaterialFetch,
);

export const selectError = createSelector(
  selectMaterialState,
  (state) => state.materialFetchError,
);

export const selectMaterial = createSelector(
  selectMaterialState,
  (state) => state.selectedMaterial,
);

export const selectViewMode = createSelector(
  selectMaterialState,
  (state) => state.viewMode,
);
