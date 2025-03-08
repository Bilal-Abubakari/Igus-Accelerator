import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MATERIAL_FEATURE_KEY, MaterialState } from './material.reducer';

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

export const selectSelectedMaterialId = createSelector(
  selectMaterialState,
  (state) => state.selectedMaterialId,
);

export const isMaterialSelected = (id: string) =>
  createSelector(selectSelectedMaterialId, (selectedId) => selectedId === id);

export const MaterialSelectors = {
  selectAllMaterials,
  selectMaterialById: (id: string) =>
    createSelector(selectAllMaterials, (materials) =>
      materials.find((material) => material.id === id),
    ),
  selectLoading,
  selectError,
  selectSelectedMaterialId,
  isMaterialSelected,
};
