import { FooterState } from './footer.state';
import { FOOTER_FEATURE_KEY } from './footer.reducers';
import {
  selectFooterState,
  selectIsSubscriptionLoading,
} from './footer.selectors';

describe('Footer Selectors', () => {
  const mockFooterState: FooterState = {
    isSubscriptionLoading: true,
    message: null,
    error: null,
  };

  const mockAppState = {
    [FOOTER_FEATURE_KEY]: mockFooterState,
  };

  describe('selectFooterState', () => {
    it('should select the footer state', () => {
      const result = selectFooterState(mockAppState);
      expect(result).toEqual(mockFooterState);
    });
  });

  describe('selectIsSubscriptionLoading', () => {
    it('should select the isSubscriptionLoading property', () => {
      const result = selectIsSubscriptionLoading(mockAppState);
      expect(result).toBe(true);
    });

    it('should select the updated isSubscriptionLoading property when state changes', () => {
      const updatedState = {
        [FOOTER_FEATURE_KEY]: {
          ...mockFooterState,
          isSubscriptionLoading: false,
        },
      };
      const result = selectIsSubscriptionLoading(updatedState);
      expect(result).toBe(false);
    });
  });
});
