import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FooterService } from '../service/footer.service';
import { catchError, of, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as FooterActions from './footer.actions';

@Injectable()
export class FooterEffects {
  private readonly actions = inject(Actions);
  private readonly footerService = inject(FooterService);

  public submitFeedback = createEffect(() =>
    this.actions.pipe(
      ofType(FooterActions.beginSubmitFeedback),
      switchMap(({ feedback } ) =>
        this.footerService.submitFeedback(feedback).pipe(
          map((response) =>
            FooterActions.submitFeedbackSuccess({ id: response.id }),
          ),
          catchError(() => {
            return of(FooterActions.submitFeedbackFailure());
          }),
        ),
      ),
    ),
  );

  public updateFeedback = createEffect(() =>
    this.actions.pipe(
      ofType(FooterActions.beginUpdateFeedback),
      switchMap(({feedback}) =>
        this.footerService.updateFeedback(feedback).pipe(
          tap(() => this.resetFooterSubject()),
          map(() => FooterActions.updateFeedbackSuccess()),
          catchError(({ error: { message } }) => {
            return of(FooterActions.updateFeedbackFailure(message));
          }),
        ),
      ),
    ),
  );

  private resetFooterSubject() {
    this.footerService.emitReset();
  }
}
