import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneFieldValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rating = control.get('rating')?.value;
    const feedback = control.get('feedback')?.value;

    if (!rating && !feedback) {
      return { atLeastOneFieldRequired: true };
    }
    return null;
  };
}
