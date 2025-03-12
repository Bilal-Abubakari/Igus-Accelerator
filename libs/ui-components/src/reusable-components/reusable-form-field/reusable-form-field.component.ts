import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption {
  value: string;
  label: string;
}

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
  @Input() className = '';
  @Input() isInFooter = false;
  @Input() isSelect = false;
  @Input() isTextarea = false;
  @Input() inputType = 'text';
  @Input() selectOptions: SelectOption[] = [];
  @Input() checkboxLabel = '';
  @Input() customErrorMessages: { [key: string]: string } = {};

  private readonly defaultErrorMessages: { [key: string]: string } = {
    required: 'This field is required',
    textOnly: 'Invalid text format',
    email: 'Invalid email format',
    invalidPostalCode: 'Invalid postal code format',
    invalidPhone: 'Invalid phone number format',
    invalidCompanyName: 'Invalid company name format',
    invalidCountrySelection: 'Please select a country',
    invalidMessage: 'Invalid message format',
    requiredTrue: 'You must accept the data protection regulations',
    invalidFileType: 'Invalid file type',
    fileSize: 'File size exceeds maximum allowed',
    pattern: 'Invalid format',
    minlength: 'Input is too short',
    maxlength: 'Input is too long',
  };

  getErrorMessages(): string[] {
    if (!this.control?.errors) return [];

    const errorKeys = Object.keys(this.control.errors);
    if (errorKeys.length === 0) return [];

    const firstErrorKey = errorKeys[0];
    const errorMessage =
      this.customErrorMessages[firstErrorKey] ||
      this.defaultErrorMessages[firstErrorKey] ||
      `Validation error: ${firstErrorKey}`;

    return [errorMessage];
  }
}
