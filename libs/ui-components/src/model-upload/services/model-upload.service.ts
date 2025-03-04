import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadDirectory, UploadProgress, UploadResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ModelUploadService {
  private readonly http = inject(HttpClient);
  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}

  public uploadFile(
    file: File,
    directory: UploadDirectory,
  ): Observable<UploadProgress | UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);

    return this.http
      .post<UploadResponse>(`${this.baseUrl}/upload`, formData, {
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
