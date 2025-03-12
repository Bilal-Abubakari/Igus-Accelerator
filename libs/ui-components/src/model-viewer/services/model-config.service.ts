import { HttpClient, HttpEventType } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import {
  ConfigCount,
  ModelConfigurationEntity,
} from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadDirectory, UploadProgress } from '../types/model-upload.types';
import {
  LocalStorageKeys,
  LocalStorageService,
} from 'libs/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ModelConfigService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

  constructor(
    @Inject('BASE_API_URL')
    private readonly baseUrl: string,
  ) {}

  public uploadConfig(
    file: File,
    directory: UploadDirectory,
  ): Observable<UploadProgress | ModelConfigurationEntity> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);

    return this.http
      .post<ModelConfigurationEntity | UploadProgress>(
        `${this.baseUrl}/configuration/upload`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
          withCredentials: true,
        },
      )
      .pipe(
        map((event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            return {
              name: '',
              progress: Math.round((100 * event.loaded) / event.total),
            } as UploadProgress;
          } else if (event.type === HttpEventType.Response) {
            return event.body as ModelConfigurationEntity;
          }
          return { name: '', progress: 0 };
        }),
      );
  }

  public getActiveConfig(configId: string) {
    return this.http.get<ModelConfigurationEntity>(
      `${this.baseUrl}/configuration/${configId}`,
    );
  }

  public getTotalCustomerConfigs(): Observable<ConfigCount> {
    return this.http.get<ConfigCount>(`${this.baseUrl}/configuration/count`);
  }

  public updateConfigSnapshot(
    snapshot: string,
    failedUpdateCallback: () => void,
  ): Observable<ModelConfigurationEntity | undefined> {
    const activeConfig = this.localStorageService.getLocalItem(
      LocalStorageKeys.ACTIVE_CONFIG,
    );

    if (!activeConfig) {
      failedUpdateCallback();
      return of(undefined);
    }

    return this.http.patch<ModelConfigurationEntity>(
      `${this.baseUrl}/configuration/${activeConfig}/snapshot`,
      { snapshot },
    );
  }

  public getModelConfigs(): Observable<ModelConfigurationEntity[]> {
    return this.http.get<ModelConfigurationEntity[]>(
      `${this.baseUrl}/configuration/customer`,
    );
  }
}
