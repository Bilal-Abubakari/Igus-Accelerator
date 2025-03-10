import { FOOTER_FEATURE_KEY } from './footer.reducer';
import {
  selectFeedbackId,
  selectFeedbackLoading,
  selectFooterState,
  selectIsEmailUpdated,
  selectIsFeedbackSubmitted,
} from './footer.selectors';
import { FooterState } from './footer.state';

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
      const result = selectFooterState({
        [FOOTER_FEATURE_KEY]: initialState,
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

      const result = selectFeedbackLoading({
        [FOOTER_FEATURE_KEY]: state,
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

      const result = selectFeedbackId({
        [FOOTER_FEATURE_KEY]: state,
      });

      expect(result).toBe(feedbackId);
    });

    it('should return null when feedbackId is not set', () => {
      const result = selectFeedbackId({
        [FOOTER_FEATURE_KEY]: initialState,
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

      const result = selectIsFeedbackSubmitted({
        [FOOTER_FEATURE_KEY]: state,
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

      const result = selectIsEmailUpdated({
        [FOOTER_FEATURE_KEY]: state,
      });

      expect(result).toBe(true);
    });
  });

  describe('selector behavior with incomplete state', () => {
    it('should handle missing properties gracefully', () => {
      const incompleteState = {
        [FOOTER_FEATURE_KEY]: {} as FooterState,
      };

      expect(selectFeedbackLoading(incompleteState)).toBeUndefined();
      expect(selectFeedbackId(incompleteState)).toBeUndefined();
      expect(selectIsFeedbackSubmitted(incompleteState)).toBeUndefined();
      expect(selectIsEmailUpdated(incompleteState)).toBeUndefined();
    });
  });
});
