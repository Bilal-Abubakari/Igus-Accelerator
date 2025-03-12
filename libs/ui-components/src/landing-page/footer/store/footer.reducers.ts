import { Action, createReducer, on } from '@ngrx/store';
import { FooterState, initialFooterState } from './footer.state';
import { NewsletterActions } from './footer.actions';

export const FOOTER_FEATURE_KEY = 'footerState';

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

export function footerReducer(
  state: FooterState | undefined,
  action: Action<string>,
) {
  return reducer(state, action);
}
