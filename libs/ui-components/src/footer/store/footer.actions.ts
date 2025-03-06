import { createAction, props } from '@ngrx/store';
import { FeedbackInterface } from '../footer.interface';

export const BEGIN_SUBMIT_FEEDBACK = '[FEEDBACK] begin submit feedback.';
export const beginSubmitFeedback = createAction(
  BEGIN_SUBMIT_FEEDBACK,
  props<{
    feedback: FeedbackInterface;
  }>(),
);

export const SUBMIT_FEEDBACK_SUCCESS = '[FEEDBACK] submit feedback success.';
export const submitFeedbackSuccess = createAction(
  SUBMIT_FEEDBACK_SUCCESS,
  props<{
    id: string;
  }>(),
);

export const SUBMIT_FEEDBACK_FAILURE = '[FEEDBACK] Submit Feedback Failure';
export const submitFeedbackFailure = createAction(SUBMIT_FEEDBACK_FAILURE);

export const BEGIN_UPDATE_FEEDBACK = '[FEEDBACK] begin update feedback.';
export const beginUpdateFeedback = createAction(
  BEGIN_UPDATE_FEEDBACK,
  props<{
    email: FeedbackInterface;
  }>(),
);

export const UPDATE_FEEDBACK_SUCCESS = '[FEEDBACK] update feedback success.';
export const updateFeedbackSuccess = createAction(UPDATE_FEEDBACK_SUCCESS);

export const UPDATE_FEEDBACK_FAILURE = '[FEEDBACK] update feedback failure';
export const updateFeedbackFailure = createAction(
  UPDATE_FEEDBACK_FAILURE,
  props<{
    message?: string;
  }>(),
);
