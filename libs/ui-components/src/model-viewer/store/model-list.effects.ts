import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ModelConfigService } from '../services/model-config.service';
import { ModelListActions } from './model-list.actions';

@Injectable()
export class ModelListEffects {
  private readonly actions$ = inject(Actions);
  private readonly modelConfigService = inject(ModelConfigService);

  loadModelList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModelListActions.loadModelList),
      exhaustMap(() =>
        this.modelConfigService.getModelConfigs().pipe(
          map((modelList) =>
            ModelListActions.loadModelListSuccess({
              modelList: modelList ?? [],
            }),
          ),
          catchError((error) => {
            return of(
              ModelListActions.loadModelListFailure({
                errorFetchingModel: error.message || 'Failed to fetch models',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
