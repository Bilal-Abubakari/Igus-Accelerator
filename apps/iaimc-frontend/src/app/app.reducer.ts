import {
  FOOTER_FEATURE_KEY,
  footerReducer,
} from 'libs/ui-components/src/footer/store/reducers/footer.reducer';
import {
  CONTACT_FORM_FEATURE_KEY,
  contactFormReducer,
} from 'libs/ui-components/src/contact-form/store/contact-form.reducer';
import {
  MODEL_LIST_FEATURE_KEY,
  modelListReducer,
} from 'libs/ui-components/src/model-viewer/store/model-list.reducers';

export const appReducer = {
  [FOOTER_FEATURE_KEY]: footerReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
  [MODEL_LIST_FEATURE_KEY]: modelListReducer,
};
