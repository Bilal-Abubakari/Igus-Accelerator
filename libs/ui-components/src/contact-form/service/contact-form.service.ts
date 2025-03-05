import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ContactFormData } from '../contact-form.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactFormService {
  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_API_URL') private readonly baseUrl: string,
  ) {}

  submitContactForm(data: ContactFormData): Observable<ContactFormData> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });

    return this.http
      .post<ContactFormData>(`${this.baseUrl}/contact_forms`, formData)
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Failed to submit form. Try again.'),
          );
        }),
      );
  }
}
