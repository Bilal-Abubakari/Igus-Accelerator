import { Action, createReducer, on } from '@ngrx/store';
import { NewLetterState, initialFooterState } from './footer.state';
import { NewsletterActions } from './footer.actions';

export const NEWS_LETTER_SUBSCRIBER_FEATURE_KEY = 'footerState';

const reducer = createReducer(
  initialFooterState,
  on(NewsletterActions.subscribe, (state) => ({
    ...state,
    isSubscriptionLoading: true,
    error: null,
  })),
  on(NewsletterActions.subscribeSuccess, (state) => ({
    ...state,
    isSubscriptionLoading: false,
    error: null,
  })),
  on(NewsletterActions.subscribeFailure, (state, { message }) => ({
    ...state,
    isSubscriptionLoading: false,
    error: message,
  })),
);
export function newsLetterSubscriberReducer(
  state: NewLetterState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
