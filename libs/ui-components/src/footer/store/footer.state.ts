export interface FooterState {
  isFeedbackLoading: boolean;
  feedbackId: string | null;
  isFeedbackSubmitted: boolean;
  isEmailUpdated: boolean;
  message: string | null;
}

export const initialFooterState: FooterState = {
  isFeedbackLoading: false,
  isFeedbackSubmitted: false,
  isEmailUpdated: false,
  feedbackId: null,
  message: null,
};
