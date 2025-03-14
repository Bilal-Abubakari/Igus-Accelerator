import { Action } from '@ngrx/store';
import { SubscriptionRequest } from '../footer.interface';
import { NewsletterActions } from './footer.actions';
import {
  NEWS_LETTER_SUBSCRIBER_FEATURE_KEY,
  newsLetterSubscriberReducer,
} from './footer.reducers';
import { NewLetterState, initialFooterState } from './footer.state';

describe('Newsletter Reducer', () => {
  it('should return the initial state', () => {
    const action: Action = { type: 'NOOP' };
    const result = newsLetterSubscriberReducer(undefined, action);

    expect(result).toEqual(initialFooterState);
  });

  it('should set isSubscriptionLoading to true when subscribe action is dispatched', () => {
    const subscriber: SubscriptionRequest = {
      email: 'test@example.com',
      firstName: 'John',
    };
    const action = NewsletterActions.subscribe({ subscriber });
    const result = newsLetterSubscriberReducer(initialFooterState, action);

    expect(result).toEqual({
      ...initialFooterState,
      isSubscriptionLoading: true,
      error: null,
    });
  });

  it('should set isSubscriptionLoading to false when subscribeSuccess action is dispatched', () => {
    const loadingState: NewLetterState = {
      ...initialFooterState,
      isSubscriptionLoading: true,
    };

    const action = NewsletterActions.subscribeSuccess();
    const result = newsLetterSubscriberReducer(loadingState, action);

    expect(result).toEqual({
      ...loadingState,
      isSubscriptionLoading: false,
      error: null,
    });
  });

  it('should set error message when subscribeFailure action is dispatched with message', () => {
    const loadingState: NewLetterState = {
      ...initialFooterState,
      isSubscriptionLoading: true,
    };

    const errorMessage = 'Subscription failed';
    const action = NewsletterActions.subscribeFailure({
      message: errorMessage,
    });
    const result = newsLetterSubscriberReducer(loadingState, action);

    expect(result).toEqual({
      ...loadingState,
      isSubscriptionLoading: false,
      error: errorMessage,
    });
  });

  it('should set error to undefined when subscribeFailure action is dispatched without message', () => {
    const loadingState: NewLetterState = {
      ...initialFooterState,
      isSubscriptionLoading: true,
      error: 'Previous error',
    };

    const action = NewsletterActions.subscribeFailure({});
    const result = newsLetterSubscriberReducer(loadingState, action);

    expect(result).toEqual({
      ...loadingState,
      isSubscriptionLoading: false,
      error: undefined,
    });
  });

  it('should maintain feature key', () => {
    expect(NEWS_LETTER_SUBSCRIBER_FEATURE_KEY).toBe('footerState');
  });
});
