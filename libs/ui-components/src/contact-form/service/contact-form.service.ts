import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ContactFormData } from '../contact-form.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactFormService {
  private readonly apiEndpoint = 'contact_forms';

  constructor(
    private readonly http: HttpClient,
    @Inject('BASE_API_URL') private readonly baseUrl: string,
  ) {}

  submitContactForm(
    formData: ContactFormData,
  ): Observable<{ success: boolean; messageId: string }> {
    const url = `${this.baseUrl}/${this.apiEndpoint}`;
    const requestFormData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'file' && value) {
        requestFormData.append('file', value, value.name);
      } else if (value !== null && value !== undefined) {
        requestFormData.append(key, value.toString());
      }
    });

    return this.http
      .post<{ success: boolean; messageId: string }>(url, requestFormData, {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
