import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FeedbackResponse, FeedbackRequest } from '../footer.interface';
import { Store } from '@ngrx/store';
import { selectFeedbackId } from '../store/selectors/footer.selectors';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);
  private readonly resetSubject = new Subject<boolean>();
  private readonly feedbackId = this.store.selectSignal(selectFeedbackId);

  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}

  public submitFeedback(
    feedback: FeedbackRequest,
  ): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(
      `${this.baseUrl}/user-feedback`,
      feedback,
    );
  }

  public updateFeedback(email: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/user-feedback/${this.feedbackId()}`,
      { email },
    );
  }

  public emitReset() {
    this.resetSubject.next(true);
  }
  public getResetObservable(): Observable<boolean> {
    return this.resetSubject.asObservable();
  }
}
