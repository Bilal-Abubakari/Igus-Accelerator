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
    return (control: AbstractControl) => {
      if (!control.value || control.value.trim() === '') {
        return null;
      }
      return /^\+?[\d-]+$/.test(control.value) ? null : { invalidPhone: true };
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

  static fileType(allowedTypes: string[], maxSizeMB?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const file = control.value;

      const isValidType = allowedTypes.includes(file.type);
      if (!isValidType) {
        return { invalidFileType: { allowed: allowedTypes } };
      }

      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        return { fileSize: { maxSize: maxSizeMB } };
      }

      return null;
    };
  }
}
