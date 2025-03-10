import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ContactFormActions } from './contact-form.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactFormService } from '../service/contact-form.service';
import { CountryService } from '../service/countries.service';

@Injectable()
export class ContactFormEffects {
  constructor(
    private readonly contactFormService: ContactFormService,
    private readonly countryService: CountryService,
    private readonly snackBar: MatSnackBar,
  ) {}
  private readonly actions = inject(Actions);

  submitForm$ = createEffect(() =>
    this.actions.pipe(
      ofType(ContactFormActions.submitForm),
      switchMap(({ formData }) =>
        this.contactFormService.submitContactForm(formData).pipe(
          tap(() => {
            this.snackBar.open('Form submitted successfully!', 'Close', {
              duration: 3000,
            });
          }),
          map(() => ContactFormActions.submitFormSuccess()),
          catchError((error) => {
            this.snackBar.open(`Submission failed: ${error.message}`, 'Close', {
              duration: 5000,
            });
            return of(
              ContactFormActions.submitFormFailure({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  loadCountries$ = createEffect(() =>
    this.actions.pipe(
      ofType(ContactFormActions.loadCountries),
      switchMap(() =>
        this.countryService.getCountries().pipe(
          map((countries) =>
            ContactFormActions.loadCountriesSuccess({ countries }),
          ),
          catchError((error) =>
            of(
              ContactFormActions.loadCountriesFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
