import { FormControl, FormGroup } from '@angular/forms';

export  function formField(field: string, formGroup: FormGroup): FormControl {
  return formGroup.get(field) as FormControl;
}
