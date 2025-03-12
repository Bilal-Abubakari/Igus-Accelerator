import { inject, Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SubscriptionRequest } from '../../footer.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly resetSubject = new Subject<boolean>();

  private readonly http = inject(HttpClient);
  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}

  public onSubscribeSubmit(payload: SubscriptionRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/subscribe`, payload);
  }

  public emitReset() {
    this.resetSubject.next(true);
  }
  public getResetObservable(): Observable<boolean> {
    return this.resetSubject.asObservable();
  }
}
