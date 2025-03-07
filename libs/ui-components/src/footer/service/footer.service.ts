import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FeedbackInterface, FeedbackRequest } from '../footer.interface';
import { Store } from '@ngrx/store';
import { selectFeedbackId } from '../store/footer.selectors';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);

  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}
  private readonly resetSubject = new Subject<boolean>();
  private readonly feedbackId = this.store.selectSignal(selectFeedbackId);

  public submitFeedback(
    feedback: FeedbackRequest,
  ): Observable<FeedbackInterface> {
    return this.http.post<FeedbackInterface>(
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
