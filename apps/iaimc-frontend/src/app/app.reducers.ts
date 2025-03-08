import { ActionReducerMap } from '@ngrx/store';
import {
  materialReducer,
  MaterialState,
  MATERIAL_FEATURE_KEY,
} from 'libs/ui-components/src/material-view/store/material.reducer';

export interface AppState {
  [MATERIAL_FEATURE_KEY]: MaterialState;
}

export const appReducer: ActionReducerMap<AppState> = {
  [MATERIAL_FEATURE_KEY]: materialReducer,
};
