export interface FooterState {
  isSubscriptionLoading: boolean;
  message: string | null;
  error?: string | null;
}

export const initialFooterState: FooterState = {
  isSubscriptionLoading: false,
  message: null,
  error: null,
};
