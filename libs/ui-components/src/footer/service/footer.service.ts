import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FeedbackInterface } from '../footer.interface';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly FEEDBACK_ID_KEY = 'feedback_id';

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_API_URL') private readonly baseUrl: string,
  ) {}

  public submitFeedback(
    feedback: FeedbackInterface,
  ): Observable<{ id: string }> {
    return this.http
      .post<{ id: string }>(`${this.baseUrl}/user-feedback`, feedback)
      .pipe(
        tap((response: { id: string }) => {
          if (response.id) {
            localStorage.setItem(this.FEEDBACK_ID_KEY, response.id);
          }
        }),
      );
  }

  public updateFeedback(feedback: FeedbackInterface): Observable<void> {
    const feedbackId = localStorage.getItem(this.FEEDBACK_ID_KEY);
    return this.http.patch<void>(
      `${this.baseUrl}/user-feedback/${feedbackId}`,
      feedback,
    );
  }
}
