import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FooterState } from './footer.state';
import { FOOTER_FEATURE_KEY } from './reducers/footer.reducer';

export const selectFooterState =
  createFeatureSelector<FooterState>(FOOTER_FEATURE_KEY);

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
