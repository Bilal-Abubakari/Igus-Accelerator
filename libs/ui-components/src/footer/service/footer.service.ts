import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { FeedbackInterface } from '../footer.interface';
import { Store } from '@ngrx/store';
import { selectFeedbackId } from '../store/footer.selectors';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly FEEDBACK_ID_KEY = 'feedback_id';
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);

  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}
  private readonly resetSubject = new Subject<boolean>();
  private readonly feedbackId = this.store.selectSignal(selectFeedbackId);

  public submitFeedback(
    feedback: FeedbackInterface,
  ): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.baseUrl}/user-feedback`,
      feedback,
    );
  }

  public updateFeedback(feedback: FeedbackInterface): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/user-feedback/${this.feedbackId()}`,
      feedback,
    );
  }

  public emitReset() {
    this.resetSubject.next(true);
  }
  public getResetObservable(): Observable<boolean> {
    return this.resetSubject.asObservable();
  }
}
