import { Action } from '@ngrx/store';
import { FooterState, initialFooterState } from './footer.state';
import { NewsletterActions } from './footer.actions';
import { FOOTER_FEATURE_KEY, footerReducer } from './footer.reducers';
import { SubscriptionRequest } from '../footer.interface';

describe('Footer Reducer', () => {
  it('should return the initial state', () => {
    const action: Action = { type: 'NOOP' };
    const result = footerReducer(undefined, action);

    expect(result).toEqual(initialFooterState);
  });

  it('should set isSubscriptionLoading to true when subscribe action is dispatched', () => {
    const subscriber: SubscriptionRequest = {
      email: 'test@example.com',
      firstName: 'John',
    };
    const action = NewsletterActions.subscribe({ subscriber });
    const result = footerReducer(initialFooterState, action);

    expect(result).toEqual({
      ...initialFooterState,
      isSubscriptionLoading: true,
      error: null,
    });
  });

  it('should set isSubscriptionLoading to false when subscribeSuccess action is dispatched', () => {
    const loadingState: FooterState = {
      ...initialFooterState,
      isSubscriptionLoading: true,
    };

    const action = NewsletterActions.subscribeSuccess();
    const result = footerReducer(loadingState, action);

    expect(result).toEqual({
      ...loadingState,
      isSubscriptionLoading: false,
      error: null,
    });
  });

  it('should set error message when subscribeFailure action is dispatched with message', () => {
    const loadingState: FooterState = {
      ...initialFooterState,
      isSubscriptionLoading: true,
    };

    const errorMessage = 'Subscription failed';
    const action = NewsletterActions.subscribeFailure({
      message: errorMessage,
    });
    const result = footerReducer(loadingState, action);

    expect(result).toEqual({
      ...loadingState,
      isSubscriptionLoading: false,
      error: errorMessage,
    });
  });

  it('should set error to undefined when subscribeFailure action is dispatched without message', () => {
    const loadingState: FooterState = {
      ...initialFooterState,
      isSubscriptionLoading: true,
      error: 'Previous error',
    };

    const action = NewsletterActions.subscribeFailure({});
    const result = footerReducer(loadingState, action);

    expect(result).toEqual({
      ...loadingState,
      isSubscriptionLoading: false,
      error: undefined,
    });
  });

  it('should maintain feature key', () => {
    expect(FOOTER_FEATURE_KEY).toBe('footerState');
  });
});
