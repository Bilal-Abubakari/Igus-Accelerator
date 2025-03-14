import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectOption } from '../../contact-form/contact-form.interface';
import { DEFAULT_ERROR_MESSAGES } from '../../utilities/error-messages';

@Component({
  selector: 'app-reusable-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './reusable-form-field.component.html',
  styleUrl: './reusable-form-field.component.scss',
})
export class ReusableFormFieldComponent {
  @Input() control!: FormControl;
  @Input() label = '';
  @Input() optional?: boolean;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() customErrorMessages: { [key: string]: string } = {};
  @Input() className = '';
  @Input() isInFooter = false;
  @Input() isSelect = false;
  @Input() isTextarea = false;
  @Input() inputType = 'text';
  @Input() selectOptions: SelectOption[] = [];
  @Input() checkboxLabel = '';
  @Input() errorAlignment: 'left' | 'center' | 'right' = 'left';

  getErrorMessages(): string[] {
    if (!this.control?.errors) return [];

    const errorKeys = Object.keys(this.control.errors);
    if (errorKeys.length === 0) return [];

    const firstErrorKey = errorKeys[0];
    const errorMessage =
      this.errorMessages[firstErrorKey] ||
      DEFAULT_ERROR_MESSAGES[firstErrorKey] ||
      `Validation error: ${firstErrorKey}`;

    return [errorMessage];
  }
}
