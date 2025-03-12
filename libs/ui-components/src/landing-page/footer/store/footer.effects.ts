import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FooterService } from '../service/footer/footer.service';
import { NewsletterActions } from './footer.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class NewsletterEffects {
  private readonly actions = inject(Actions);
  private readonly footerService = inject(FooterService);

  public subscribe = createEffect(() =>
    this.actions.pipe(
      ofType(NewsletterActions.subscribe),
      switchMap(({ subscriber }) =>
        this.footerService.onSubscribeSubmit(subscriber).pipe(
          tap(() => this.resetNewsLetterSubject()),
          map(() => NewsletterActions.subscribeSuccess()),
          catchError(({ error: { message } }) => {
            return of(NewsletterActions.subscribeFailure({ message }));
          }),
        ),
      ),
    ),
  );
  private resetNewsLetterSubject() {
    this.footerService.emitReset();
  }
}
