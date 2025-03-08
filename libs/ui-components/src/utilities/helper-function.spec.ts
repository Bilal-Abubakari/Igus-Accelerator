import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formField } from '../utilities/helper-function';

describe('formField Helper Function', () => {
  let formBuilder: FormBuilder;
  let testForm: FormGroup;

  beforeEach(() => {
    formBuilder = new FormBuilder();

    testForm = formBuilder.group({
      username: new FormControl('testuser', [Validators.required]),
      email: new FormControl('test@example.com', [Validators.email]),
      age: new FormControl(30, [Validators.min(18)]),
    });
  });

  it('should return the correct FormControl for an existing field', () => {
    const usernameControl = formField('username', testForm);

    expect(usernameControl).toBe(testForm.get('username'));
    expect(usernameControl).toBeInstanceOf(FormControl);
    expect(usernameControl.value).toBe('testuser');
  });

  it('should return the correct FormControl for another existing field', () => {
    const emailControl = formField('email', testForm);

    expect(emailControl).toBe(testForm.get('email'));
    expect(emailControl).toBeInstanceOf(FormControl);
    expect(emailControl.value).toBe('test@example.com');
  });

  it('should return null for a non-existent field', () => {
    const nonexistentControl = formField('nonexistentField', testForm);
    expect(nonexistentControl).toBeNull();
  });

  it('should return the correct FormGroup for a nested group', () => {
    const complexForm = formBuilder.group({
      user: formBuilder.group({
        name: ['John'],
        details: ['Additional info'],
      }),
      email: new FormControl('test@example.com'),
    });

    const userGroup = formField('user', complexForm);
    expect(userGroup).toBe(complexForm.get('user'));
    expect(userGroup).toBeInstanceOf(FormGroup);
  });
});
