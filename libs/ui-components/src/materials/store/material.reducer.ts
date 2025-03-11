import { Action, createReducer, on } from '@ngrx/store';
import { MaterialActions } from './material.actions';
import { getTextColor } from '../../utilities/color.utils';
import { initialMaterialState, MaterialState } from './material.state';

export const MATERIAL_FEATURE_KEY = 'materialState';

const reducer = createReducer(
  initialMaterialState,
  on(MaterialActions.loadMaterials, (state) => ({
    ...state,
    triggerMaterialFetch: true,
    materialFetchError: null,
  })),
  on(MaterialActions.loadMaterialsSuccess, (state, { materials }) => ({
    ...state,
    triggerMaterialFetch: false,
    materials: materials.map((material) => ({
      ...material,
      textColor: getTextColor(material.colorHex),
    })),
    materialFetchError: null,
  })),
  on(MaterialActions.loadMaterialsFailure, (state, { materialFetchError }) => ({
    ...state,
    triggerMaterialFetch: false,
    materialFetchError,
  })),
  on(MaterialActions.toggleMaterialSelection, (state, { materialId }) => ({
    ...state,
    selectedMaterialId:
      state.selectedMaterialId === materialId ? null : materialId,
  })),
);

export function materialReducer(
  state: MaterialState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
