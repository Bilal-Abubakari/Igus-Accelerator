import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FOOTER_FEATURE_KEY } from './footer.reducer';
import { FooterModel } from './footer.state';

export const selectFooterState =
  createFeatureSelector<FooterModel>(FOOTER_FEATURE_KEY);

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
