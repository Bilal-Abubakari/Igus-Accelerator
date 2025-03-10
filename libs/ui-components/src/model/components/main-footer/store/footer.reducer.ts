import { Action, createReducer, on } from '@ngrx/store';
import { FooterState, initialFooterState } from './footer.state';
import { FooterActions } from './footer.actions';


export const FOOTER_FEATURE_KEY = 'footerState';

const reducer = createReducer(
  initialFooterState,
  on(FooterActions.beginSubmitFeedback, (state) => ({
    ...state,
    isFeedbackLoading: true,
    error: null,
  })),

  on(FooterActions.submitFeedbackSuccess, (state, { id }) => ({
    ...state,
    isFeedbackLoading: false,
    isFeedbackSubmitted: true,
    feedbackId: id,
    error: null,
  })),

  on(FooterActions.submitFeedbackFailure, (state) => ({
    ...state,
    isFeedbackSubmitted: false,
    isFeedbackLoading: false,
  })),

  on(FooterActions.beginUpdateFeedback, (state) => ({
    ...state,
    isFeedbackLoading: true,
    error: null,
  })),
  on(FooterActions.updateFeedbackSuccess, (state) => ({
    ...state,
    isFeedbackLoading: false,
    isEmailUpdated: true,
    error: null,
  })),
  on(FooterActions.updateFeedbackFailure, (state) => ({
    ...state,
    isEmailUpdated: false,
    isFeedbackLoading: false,
  })),
);

export function footerReducer(
  state: FooterState | undefined,
  action: Action<string>,
) {
  return reducer(state, action);
}
