export interface FeedbackResponse {
  rating?: number | null;
  comment?: string | null;
  email?: string | null;
  id: string;
}

export type FeedbackRequest = Omit<FeedbackResponse, 'id'>;
