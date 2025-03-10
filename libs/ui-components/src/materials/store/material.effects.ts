import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MaterialService } from '../service/material.service';
import { MaterialActions } from './material.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Material } from './material.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class MaterialEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly materialService: MaterialService,
  ) {
    this.loadMaterials$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MaterialActions.loadMaterials),
        mergeMap(() =>
          this.materialService.getMaterials().pipe(
            map((materials: Material[]) =>
              MaterialActions.loadMaterialsSuccess({ materials }),
            ),
            catchError(({ message }: HttpErrorResponse) =>
              of(
                MaterialActions.loadMaterialsFailure({
                  materialFetchError: message,
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }

  loadMaterials$;
}
