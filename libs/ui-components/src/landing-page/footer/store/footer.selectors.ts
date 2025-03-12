import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NewLetterState } from './footer.state';
import { NEWS_LETTER_SUBSCRIBER_FEATURE_KEY } from './footer.reducers';

export const selectFooterState = createFeatureSelector<NewLetterState>(
  NEWS_LETTER_SUBSCRIBER_FEATURE_KEY,
);

export const selectIsSubscriptionLoading = createSelector(
  selectFooterState,
  ({ isSubscriptionLoading }) => isSubscriptionLoading,
);
