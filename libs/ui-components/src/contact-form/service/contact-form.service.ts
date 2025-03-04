import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ContactFormData } from '../contact-form.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactFormService {
  private readonly apiUrl = 'http://localhost:3000/contact_forms';

  constructor(private readonly http: HttpClient) {}

  submitContactForm(data: ContactFormData): Observable<ContactFormData> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });

    return this.http.post<ContactFormData>(this.apiUrl, formData).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to submit form. Try again.'));
      }),
    );
  }
}
