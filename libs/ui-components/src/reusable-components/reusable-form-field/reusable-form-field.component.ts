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
  @Input() isSelect = false;
  @Input() isTextarea = false;
  @Input() inputType = 'text';
  @Input() selectOptions: SelectOption[] = [];

  getErrorMessages(): string[] {
    if (!this.control?.errors) return [];

    const errorKeys = Object.keys(this.control.errors);
    if (errorKeys.length === 0) return [];

    const firstErrorKey = errorKeys[0];
    if (this.errorMessages[firstErrorKey]) {
      return [this.errorMessages[firstErrorKey]];
    }

    return [`Validation error: ${firstErrorKey}`];
  }
}
