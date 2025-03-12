import {
  MAIN_FOOTER_FEATURE_KEY,
  mainFooterReducer,
} from '../../../../libs/ui-components/src/model/components/main-footer/store/footer.reducer';
import {
  CONTACT_FORM_FEATURE_KEY,
  contactFormReducer,
} from 'libs/ui-components/src/contact-form/store/contact-form.reducer';
import {
  FOOTER_FEATURE_KEY,
  footerReducer,
} from '../../../../libs/ui-components/src/landing-page/footer/store/footer.reducers';

export const appReducer = {
  [MAIN_FOOTER_FEATURE_KEY]: mainFooterReducer,
  [CONTACT_FORM_FEATURE_KEY]: contactFormReducer,
  [FOOTER_FEATURE_KEY]: footerReducer,
};
