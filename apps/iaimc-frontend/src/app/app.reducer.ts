import { ActionReducerMap } from '@ngrx/store';
import {
  materialReducer,
  MATERIAL_FEATURE_KEY,
} from 'libs/ui-components/src/materials/store/material.reducer';
import {
  FOOTER_FEATURE_KEY,
  footerReducer,
} from '../../../../libs/ui-components/src/model/components/main-footer/store/footer.reducer';
import { MaterialState } from 'libs/ui-components/src/materials/store/material.state';

import { ContactFormState } from 'libs/ui-components/src/contact-form/store/contact-form.models';
import { FooterState } from 'libs/ui-components/src/model/components/main-footer/store/footer.state';
import {
  CONTACT_FORM_FEATURE_KEY,
  contactFormReducer,
} from 'libs/ui-components/src/contact-form/store/reducer/contact-form.reducer';

export interface AppState {
  [MATERIAL_FEATURE_KEY]: MaterialState;
  [FOOTER_FEATURE_KEY]: FooterState;
  [CONTACT_FORM_FEATURE_KEY]: ContactFormState;
}

export const appReducer: ActionReducerMap<AppState> = {
  [MATERIAL_FEATURE_KEY]: materialReducer,
  [FOOTER_FEATURE_KEY]: footerReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
};
