import { FormGroup, FormControl } from '@angular/forms';
import { atLeastOneFieldValidator } from './custom.validator';

describe('atLeastOneFieldValidator', () => {
  it('should return null if control is not a FormGroup', () => {
    const validator = atLeastOneFieldValidator(['a']);
    const result = validator({} as any);
    expect(result).toBeNull();
  });

  it('should return error if none of the specified fields are filled', () => {
    const formGroup = new FormGroup({
      a: new FormControl(''),
      b: new FormControl(null),
    });
    const validator = atLeastOneFieldValidator(['a', 'b']);
    const result = validator(formGroup);
    expect(result).toEqual({ atLeastOneFieldRequired: true });
  });

  it('should return null if at least one field is filled (non-empty string)', () => {
    const formGroup = new FormGroup({
      a: new FormControl(''),
      b: new FormControl('value'),
    });
    const validator = atLeastOneFieldValidator(['a', 'b']);
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should return null if at least one field is filled (non-null number)', () => {
    const formGroup = new FormGroup({
      a: new FormControl(0), 
      b: new FormControl(5),
    });
    const validator = atLeastOneFieldValidator(['a', 'b']);
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should return error if a field is missing and the present field is not filled', () => {
    const formGroup = new FormGroup({
      a: new FormControl(''),
    });
    const validator = atLeastOneFieldValidator(['a', 'b']);
    const result = validator(formGroup);
    expect(result).toEqual({ atLeastOneFieldRequired: true });
  });
});
