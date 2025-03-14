import { SubscriptionRequest } from '../footer.interface';
import { NewsletterActions } from './footer.actions';

describe('Newsletter Actions', () => {
  it('should create a subscribe action', () => {
    const subscriber: SubscriptionRequest = {
      email: 'test@example.com',
      firstName: 'John',
    };
    const action = NewsletterActions.subscribe({ subscriber });

    expect(action.type).toBe('[Newsletter] Subscribe');
    expect(action.subscriber).toEqual(subscriber);
  });

  it('should create a subscribe success action', () => {
    const action = NewsletterActions.subscribeSuccess();

    expect(action.type).toBe('[Newsletter] Subscribe Success');
  });

  it('should create a subscribe failure action with a message', () => {
    const message = 'Subscription failed';
    const action = NewsletterActions.subscribeFailure({ message });

    expect(action.type).toBe('[Newsletter] Subscribe Failure');
    expect(action.message).toBe(message);
  });

  it('should create a subscribe failure action without a message', () => {
    const action = NewsletterActions.subscribeFailure({});

    expect(action.type).toBe('[Newsletter] Subscribe Failure');
    expect(action.message).toBeUndefined();
  });
});
