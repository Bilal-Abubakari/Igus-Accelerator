import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ModelUploadService } from '../../service/model-upload/model-upload.service';
import * as ModelUploadActions from './model-upload.actions';

@Injectable()
export class ModelEffects {
  private readonly actions$ = inject(Actions);
  private readonly modelUploadService = inject(ModelUploadService);

  public loadModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelUploadActions.ModelsActions.loadModels),
      mergeMap(() =>
        this.modelUploadService.getAllModels().pipe(
          map((models) =>
            ModelUploadActions.ModelsActions.loadModelsSuccess({ models }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              ModelUploadActions.ModelsActions.loadModelsFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  public uploadModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelUploadActions.ModelsActions.uploadModel),
      mergeMap(({ file }) =>
        this.modelUploadService.upload(file).pipe(
          map((model) =>
            ModelUploadActions.ModelsActions.uploadModelSuccess({ model }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              ModelUploadActions.ModelsActions.uploadModelFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private getErrorMessage(error: HttpErrorResponse): string {
    return error.error?.message || error.statusText || 'Unknown error occurred';
  }
}
