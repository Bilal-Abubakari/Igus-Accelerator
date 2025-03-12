import { ActionReducerMap } from '@ngrx/store';
import {
  materialReducer,
  MATERIAL_FEATURE_KEY,
} from 'libs/ui-components/src/materials/store/material.reducer';
import {
  MAIN_FOOTER_FEATURE_KEY,
  mainFooterReducer,
} from '../../../../libs/ui-components/src/model/components/main-footer/store/footer.reducer';
import { MaterialState } from 'libs/ui-components/src/materials/store/material.state';

import { ContactFormState } from 'libs/ui-components/src/contact-form/store/contact-form.models';
import { FooterState } from 'libs/ui-components/src/model/components/main-footer/store/footer.state';
import {
  MODEL_LIST_FEATURE_KEY,
  modelListReducer,
} from 'libs/ui-components/src/model-viewer/store/model-list.reducers';
import { ModelListState } from 'libs/ui-components/src/model-viewer/store/model-list.state';
import { CONTACT_FORM_FEATURE_KEY, contactFormReducer } from 'libs/ui-components/src/contact-form/store/reducer/contact-form.reducer';
import {
  NEWS_LETTER_SUBSCRIBER_FEATURE_KEY,
  newsLetterSubscriberReducer,
} from '../../../../libs/ui-components/src/landing-page/footer/store/footer.reducers';
import { NewLetterState } from 'libs/ui-components/src/landing-page/footer/store/footer.state';

export interface AppState {
  [MATERIAL_FEATURE_KEY]: MaterialState;
  [NEWS_LETTER_SUBSCRIBER_FEATURE_KEY]: NewLetterState;
  [MAIN_FOOTER_FEATURE_KEY]: FooterState;
  [CONTACT_FORM_FEATURE_KEY]: ContactFormState;
  [MODEL_LIST_FEATURE_KEY]: ModelListState
}

export const appReducer: ActionReducerMap<AppState> = {
  [MATERIAL_FEATURE_KEY]: materialReducer,
  [MAIN_FOOTER_FEATURE_KEY]: mainFooterReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
};
