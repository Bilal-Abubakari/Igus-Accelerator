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
import {
  CONTACT_FORM_FEATURE_KEY,
  contactFormReducer,
} from 'libs/ui-components/src/contact-form/store/contact-form.reducer';
import {
  MODEL_LIST_FEATURE_KEY,
  modelListReducer,
} from 'libs/ui-components/src/model-viewer/store/model-list.reducers';
import { ContactFormState } from 'libs/ui-components/src/contact-form/store/contact-form.models';
import { FooterState } from 'libs/ui-components/src/model/components/main-footer/store/footer.state';
import { ModelListState } from 'libs/ui-components/src/model-viewer/store/model-list.state';

export interface AppState {
  [MATERIAL_FEATURE_KEY]: MaterialState;
  [FOOTER_FEATURE_KEY]: FooterState;
  [CONTACT_FORM_FEATURE_KEY]: ContactFormState;
  [MODEL_LIST_FEATURE_KEY]: ModelListState
}

export const appReducer: ActionReducerMap<AppState> = {
  [MATERIAL_FEATURE_KEY]: materialReducer,
  [FOOTER_FEATURE_KEY]: footerReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
  [MODEL_LIST_FEATURE_KEY]: modelListReducer,
};
