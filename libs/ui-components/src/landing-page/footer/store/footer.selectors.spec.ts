import { NewLetterState } from './footer.state';
import { NEWS_LETTER_SUBSCRIBER_FEATURE_KEY } from './footer.reducers';
import {
  selectFooterState,
  selectIsSubscriptionLoading,
} from './footer.selectors';

describe('Footer Selectors', () => {
  const mockFooterState: NewLetterState = {
    isSubscriptionLoading: true,
    message: null,
    error: null,
  };

  const mockAppState = {
    [NEWS_LETTER_SUBSCRIBER_FEATURE_KEY]: mockFooterState,
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
        [NEWS_LETTER_SUBSCRIBER_FEATURE_KEY]: {
          ...mockFooterState,
          isSubscriptionLoading: false,
        },
      };
      const result = selectIsSubscriptionLoading(updatedState);
      expect(result).toBe(false);
    });
  });
});
