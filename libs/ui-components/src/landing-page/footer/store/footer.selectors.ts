import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FooterState } from './footer.state';
import { FOOTER_FEATURE_KEY } from './footer.reducers';

export const selectFooterState =
  createFeatureSelector<FooterState>(FOOTER_FEATURE_KEY);

export const selectIsSubscriptionLoading = createSelector(
  selectFooterState,
  ({ isSubscriptionLoading }) => isSubscriptionLoading,
);
