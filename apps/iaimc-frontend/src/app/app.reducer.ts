import {
  footerReducer,
  FOOTER_FEATURE_KEY,
} from '../../../../libs/ui-components/src/footer/store/footer.reducer';

export const appReducer = {
  [FOOTER_FEATURE_KEY]: footerReducer,
};
