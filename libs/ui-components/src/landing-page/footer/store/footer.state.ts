export interface NewLetterState {
  isSubscriptionLoading: boolean;
  message: string | null;
  error?: string | null;
}

export const initialFooterState: NewLetterState = {
  isSubscriptionLoading: false,
  message: null,
  error: null,
};
