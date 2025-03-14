import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MaterialService } from '../service/material.service';
import { MaterialActions } from './material.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';

@Injectable()
export class MaterialEffects {
  private readonly actions$ = inject(Actions);
  private readonly materialService = inject(MaterialService);

  loadMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MaterialActions.loadMaterials),
      mergeMap(() =>
        this.materialService.getMaterials().pipe(
          map((materials: InjectionMoldingMaterial[]) =>
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
    );
  });
}
