import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SubscriptionRequest } from '../footer.interface';

export const NewsletterActions = createActionGroup({
  source: 'Newsletter',
  events: {
    Subscribe: props<{ subscriber: SubscriptionRequest }>(),
    'Subscribe Success': emptyProps(),
    'Subscribe Failure': props<{ message?: string }>(),
  },
});
