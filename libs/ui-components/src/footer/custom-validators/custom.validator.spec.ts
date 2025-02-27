import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { atLeastOneFieldValidator } from './custom.validator';

describe('atLeastOneFieldValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup(
      {
        rating: new FormControl(''),
        feedback: new FormControl(''),
      },
      { validators: atLeastOneFieldValidator() },
    );
  });

  it('should return an error when both rating and feedback are empty', () => {
    formGroup.setValue({ rating: '', feedback: '' });
    const errors: ValidationErrors | null = formGroup.errors;
    expect(errors).toEqual({ atLeastOneFieldRequired: true });
  });

  it('should return null when only rating is provided', () => {
    formGroup.setValue({ rating: '5', feedback: '' });
    const errors: ValidationErrors | null = formGroup.errors;
    expect(errors).toBeNull();
  });

  it('should return null when only feedback is provided', () => {
    formGroup.setValue({ rating: '', feedback: 'Great service!' });
    const errors: ValidationErrors | null = formGroup.errors;
    expect(errors).toBeNull();
  });

  it('should return null when both rating and feedback are provided', () => {
    formGroup.setValue({ rating: '5', feedback: 'Great service!' });
    const errors: ValidationErrors | null = formGroup.errors;
    expect(errors).toBeNull();
  });
});
