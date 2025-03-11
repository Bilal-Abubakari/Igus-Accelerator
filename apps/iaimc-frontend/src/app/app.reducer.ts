import { ActionReducerMap } from '@ngrx/store';
import {
  materialReducer,
  MATERIAL_FEATURE_KEY,
} from 'libs/ui-components/src/materials/store/material.reducer';
import {
  FOOTER_FEATURE_KEY,
  footerReducer,
} from 'libs/ui-components/src/footer/store/reducers/footer.reducer';
import { FooterState } from 'libs/ui-components/src/footer/store/footer.state';
import { MaterialState } from 'libs/ui-components/src/materials/store/material.state';

export interface AppState {
  [MATERIAL_FEATURE_KEY]: MaterialState;
  [FOOTER_FEATURE_KEY]: FooterState;
}
import {
  CONTACT_FORM_FEATURE_KEY,
  contactFormReducer,
} from 'libs/ui-components/src/contact-form/store/contact-form.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  [MATERIAL_FEATURE_KEY]: materialReducer,
  [FOOTER_FEATURE_KEY]: footerReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
};
