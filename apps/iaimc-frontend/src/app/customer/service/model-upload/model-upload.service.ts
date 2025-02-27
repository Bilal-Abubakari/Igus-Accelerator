import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Model } from '../../store/model-upload/model-upload.state';

@Injectable({ providedIn: 'root' })
export class ModelUploadService {
  private readonly uploadUrl = '/api/models/upload';

  private readonly http = inject(HttpClient);

  public upload(file: File): Observable<Model> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Model>(this.uploadUrl, formData);
  }

  public getAllModels(): Observable<Model[]> {
    return this.http.get<Model[]>(this.uploadUrl);
  }
}
