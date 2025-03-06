import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FOOTER_FEATURE_KEY } from './footer.reducer';
import { FooterModel } from './footer.state';

export const selectFooterState =
  createFeatureSelector<FooterModel>(FOOTER_FEATURE_KEY);

export const selectFeedbackLoading = createSelector(
  selectFooterState,
  (state) => state.isFeedbackLoading,
);

export const selectFeedbackId = createSelector(
  selectFooterState,
  (state) => state.feedbackId,
);

export const selectIsFeedbackSubmitted = createSelector(
  selectFooterState,
  (state) => state.isFeedbackSubmitted,
);

export const selectIsEmailUpdated = createSelector(
  selectFooterState,
  (state) => state.isEmailUpdated,
);
