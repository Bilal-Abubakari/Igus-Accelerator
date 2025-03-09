import { ActionReducerMap } from '@ngrx/store';
import {
  materialReducer,
  MATERIAL_FEATURE_KEY,
} from 'libs/ui-components/src/material-view/store/material.reducer';
import {
  FOOTER_FEATURE_KEY,
  footerReducer,
} from 'libs/ui-components/src/footer/store/reducers/footer.reducer';
import { FooterState } from 'libs/ui-components/src/footer/store/footer.state';
import { MaterialState } from 'libs/ui-components/src/material-view/store/material.state';

export interface AppState {
  [MATERIAL_FEATURE_KEY]: MaterialState;
  [FOOTER_FEATURE_KEY]: FooterState;
}

export const appReducer: ActionReducerMap<AppState> = {
  [MATERIAL_FEATURE_KEY]: materialReducer,
  [FOOTER_FEATURE_KEY]: footerReducer,
};
