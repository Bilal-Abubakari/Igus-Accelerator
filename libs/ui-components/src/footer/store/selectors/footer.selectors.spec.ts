import * as fromFooter from '../reducers/footer.reducer';
import * as FooterSelectors from './footer.selectors';
import { FooterState } from '../footer.state';

describe('Footer Selectors', () => {
  const initialState: FooterState = {
    isFeedbackLoading: false,
    feedbackId: null,
    isFeedbackSubmitted: false,
    isEmailUpdated: false,
    message: null,
  };

  describe('selectFooterState', () => {
    it('should select the feature state', () => {
      const result = FooterSelectors.selectFooterState({
        [fromFooter.FOOTER_FEATURE_KEY]: initialState,
      });

      expect(result).toEqual(initialState);
    });
  });

  describe('selectFeedbackLoading', () => {
    it('should select the feedback loading state', () => {
      const state = {
        ...initialState,
        isFeedbackLoading: true,
      };

      const result = FooterSelectors.selectFeedbackLoading({
        [fromFooter.FOOTER_FEATURE_KEY]: state,
      });

      expect(result).toBe(true);
    });
  });

  describe('selectFeedbackId', () => {
    it('should select the feedback id', () => {
      const feedbackId = 'test-id-123';
      const state = {
        ...initialState,
        feedbackId,
      };

      const result = FooterSelectors.selectFeedbackId({
        [fromFooter.FOOTER_FEATURE_KEY]: state,
      });

      expect(result).toBe(feedbackId);
    });

    it('should return null when feedbackId is not set', () => {
      const result = FooterSelectors.selectFeedbackId({
        [fromFooter.FOOTER_FEATURE_KEY]: initialState,
      });

      expect(result).toBeNull();
    });
  });

  describe('selectIsFeedbackSubmitted', () => {
    it('should select the feedback submitted state', () => {
      const state = {
        ...initialState,
        isFeedbackSubmitted: true,
      };

      const result = FooterSelectors.selectIsFeedbackSubmitted({
        [fromFooter.FOOTER_FEATURE_KEY]: state,
      });

      expect(result).toBe(true);
    });
  });

  describe('selectIsEmailUpdated', () => {
    it('should select the email updated state', () => {
      const state = {
        ...initialState,
        isEmailUpdated: true,
      };

      const result = FooterSelectors.selectIsEmailUpdated({
        [fromFooter.FOOTER_FEATURE_KEY]: state,
      });

      expect(result).toBe(true);
    });
  });

  describe('selector behavior with incomplete state', () => {
    it('should handle missing properties gracefully', () => {
      const incompleteState = {
        [fromFooter.FOOTER_FEATURE_KEY]: {} as FooterState,
      };

      expect(
        FooterSelectors.selectFeedbackLoading(incompleteState),
      ).toBeUndefined();
      expect(FooterSelectors.selectFeedbackId(incompleteState)).toBeUndefined();
      expect(
        FooterSelectors.selectIsFeedbackSubmitted(incompleteState),
      ).toBeUndefined();
      expect(
        FooterSelectors.selectIsEmailUpdated(incompleteState),
      ).toBeUndefined();
    });
  });
});
