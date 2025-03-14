import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MAIN_FOOTER_FEATURE_KEY } from './footer.reducer';
import { FooterState } from './footer.state';

export const selectFooterState = createFeatureSelector<FooterState>(
  MAIN_FOOTER_FEATURE_KEY,
);

export const selectFeedbackLoading = createSelector(
  selectFooterState,
  ({ isFeedbackLoading }) => isFeedbackLoading,
);

export const selectFeedbackId = createSelector(
  selectFooterState,
  ({ feedbackId }) => feedbackId,
);

export const selectIsFeedbackSubmitted = createSelector(
  selectFooterState,
  ({ isFeedbackSubmitted }) => isFeedbackSubmitted,
);

export const selectIsEmailUpdated = createSelector(
  selectFooterState,
  ({ isEmailUpdated }) => isEmailUpdated,
);
