import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TextOnlyValidators {
  static textOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = /^[A-Za-z\s\-']+$/.test(control.value);
      return isValid ? null : { textOnly: true };
    };
  }

  static postalCode(): ValidatorFn {
    return (control: AbstractControl) =>
      /^\d{5}$/.test(control.value) ? null : { invalidPostalCode: true };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl) =>
      /^\+?[\d-]+$/.test(control.value) ? null : { invalidPhone: true };
  }

  static companyName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = /^[A-Za-z0-9\s\-&'.,()]+$/.test(control.value);
      return isValid ? null : { invalidCompanyName: true };
    };
  }

  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const file = control.value;
      const isValid = allowedTypes.includes(file.type);
      return isValid ? null : { invalidFileType: { allowed: allowedTypes } };
    };
  }
}
