import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/**
 * A reusable validator function that checks if at least one of the specified fields is filled.
 * @param fields - An array of field names to check.
 * @returns A ValidatorFn that can be applied to a FormGroup.
 */
export function atLeastOneFieldValidator(fields: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }
    const isAtLeastOneFilled = fields.some(
      (field) => control.get(field)?.value,
    );
    if (!isAtLeastOneFilled) {
      return { atLeastOneFieldRequired: true };
    }
    return null;
  };
}
