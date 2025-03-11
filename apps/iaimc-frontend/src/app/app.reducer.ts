import {
  FOOTER_FEATURE_KEY,
  footerReducer,
} from 'libs/ui-components/src/footer/store/reducers/footer.reducer';
import {
  CONTACT_FORM_FEATURE_KEY,
  contactFormReducer,
} from 'libs/ui-components/src/contact-form/store/reducer/contact-form.reducer';

export const appReducer = {
  [FOOTER_FEATURE_KEY]: footerReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
};
