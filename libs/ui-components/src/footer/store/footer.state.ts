import { FeedbackInterface } from '../footer.interface';

export interface FooterModel {
  isFeedbackLoading: boolean;
  feedbackId: string | null;
  isFeedbackSubmitted: boolean;
  isEmailUpdated: boolean;
  message: string | null;
}

export const initialFooterState: FooterModel = {
  isFeedbackLoading: false,
  isFeedbackSubmitted: false,
  isEmailUpdated: false,
  feedbackId: null,
  message: null,
};
