import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FeedbackRequest } from '../footer.interface';

export const FooterActions = createActionGroup({
  source: 'Feedback',
  events: {
    'Begin Submit Feedback': props<{ feedback: FeedbackRequest }>(),
    'Submit Feedback Success': props<{ id: string }>(),
    'Submit Feedback Failure': emptyProps(),
    'Begin Update Feedback': props<{ email: string }>(),
    'Update Feedback Success': emptyProps(),
    'Update Feedback Failure': props<{ message?: string }>(),
  },
});
