import { FooterActions } from './footer.actions';
import { footerReducer } from './footer.reducer';
import { initialFooterState } from './footer.state';


describe('Footer Reducer', () => {
  it('should start feedback submission by setting isFeedbackLoading to true', () => {
    const action = FooterActions.beginSubmitFeedback({
      feedback: { email: 'test@example.com' },
    });
    const newState = footerReducer(initialFooterState, action);

    expect(newState.isFeedbackLoading).toBe(true);
  });

  it('should handle successful feedback submission', () => {
    const action = FooterActions.submitFeedbackSuccess({ id: '12345' });
    const newState = footerReducer(initialFooterState, action);

    expect(newState.isFeedbackLoading).toBe(false);
    expect(newState.isFeedbackSubmitted).toBe(true);
    expect(newState.feedbackId).toBe('12345');
  });

  it('should handle feedback submission failure', () => {
    const action = FooterActions.submitFeedbackFailure();
    const newState = footerReducer(initialFooterState, action);

    expect(newState.isFeedbackLoading).toBe(false);
    expect(newState.isFeedbackSubmitted).toBe(false);
  });

  it('should start feedback update by setting isFeedbackLoading to true', () => {
    const action = FooterActions.beginUpdateFeedback({
      email: 'test@example.com',
    });
    const newState = footerReducer(initialFooterState, action);

    expect(newState.isFeedbackLoading).toBe(true);
  });

  it('should handle successful feedback update', () => {
    const action = FooterActions.updateFeedbackSuccess();
    const newState = footerReducer(initialFooterState, action);

    expect(newState.isFeedbackLoading).toBe(false);
    expect(newState.isEmailUpdated).toBe(true);
  });

  it('should handle feedback update failure', () => {
    const errorMessage = 'Failed to update feedback';
    const action = FooterActions.updateFeedbackFailure({
      message: errorMessage,
    });
    const newState = footerReducer(initialFooterState, action);

    expect(newState.isFeedbackLoading).toBe(false);
    expect(newState.isEmailUpdated).toBe(false);
  });
});
