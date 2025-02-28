import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadResponse, UploadProgress } from './types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModelUploadService {
  private apiUrl = `${environment.apiBaseUrl}/upload`;
  private readonly http = inject(HttpClient);

  public uploadFile(
    file: File,
    directory: string,
  ): Observable<UploadProgress | UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);

    return this.http
      .post<UploadResponse>(this.apiUrl, formData, {
        reportProgress: true,
        observe: 'events',
        withCredentials: true,
      })
      .pipe(
        map((event: HttpEvent<UploadResponse>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            return {
              progress: Math.round((100 * event.loaded) / event.total),
            } as UploadProgress;
          } else if (event.type === HttpEventType.Response) {
            return event.body as UploadResponse;
          }
          return { progress: 0 };
        }),
      );
  }
}
