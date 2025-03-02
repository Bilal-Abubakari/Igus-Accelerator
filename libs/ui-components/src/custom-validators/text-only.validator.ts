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
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = /^[A-Za-z0-9\s-]{3,10}$/.test(control.value);
      return isValid ? null : { invalidPostalCode: true };
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isValid = /^[+]?\d{7,15}$/.test(control.value);
      return isValid ? null : { invalidPhone: true };
    };
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
