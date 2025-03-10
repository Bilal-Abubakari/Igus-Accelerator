import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReusableFormFieldComponent } from './reusable-form-field.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Component } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

@Component({
  standalone: true,
  imports: [ReusableFormFieldComponent],
  template: `
    <app-reusable-form-field
      [control]="control"
      [label]="label"
      [optional]="true"
      [errorMessages]="errorMessages"
      [className]="className"
      [isSelect]="isSelect"
      [isTextarea]="isTextarea"
      [inputType]="inputType"
      [selectOptions]="selectOptions"
    >
    </app-reusable-form-field>
  `,
})
class TestHostComponent {
  control = new FormControl('');
  label = 'Test Label';
  optional = false;
  errorMessages = { required: 'This field is required' };
  className = 'test-class';
  flexValue: string | null = null;
  isSelect = false;
  isTextarea = false;
  inputType = 'text';
  selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];
}

describe('ReusableFormFieldComponent', () => {
  let loader: HarnessLoader;

  describe('Component tests', () => {
    let component: ReusableFormFieldComponent;
    let fixture: ComponentFixture<ReusableFormFieldComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          ReusableFormFieldComponent,
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ReusableFormFieldComponent);
      component = fixture.componentInstance;
      component.control = new FormControl('');
      component.errorMessages = { required: 'This field is required' };
      loader = TestbedHarnessEnvironment.loader(fixture);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      component = new ReusableFormFieldComponent();
      component.control = new FormControl('');

      expect(component.label).toBe('');
      expect(component.errorMessages).toEqual({});
      expect(component.className).toBe('');
      expect(component.isSelect).toBe(false);
      expect(component.isTextarea).toBe(false);
      expect(component.inputType).toBe('text');
      expect(component.selectOptions).toEqual([]);
    });

    it('should return empty array when no errors', () => {
      component.control = new FormControl('valid');
      expect(component.getErrorMessages()).toEqual([]);
    });

    it('should return error messages for control errors', () => {
      component.control = new FormControl('', [Validators.required]);
      component.control.markAsTouched();
      expect(component.getErrorMessages()).toEqual(['This field is required']);
    });

    it('should filter out undefined error messages', () => {
      component.control = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);
      component.control.markAsTouched();
      expect(component.getErrorMessages()).toEqual(['This field is required']);
    });
  });

  describe('Integration tests', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          ReusableFormFieldComponent,
          TestHostComponent,
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(hostFixture);
      hostFixture.detectChanges();
    });

    it('should display optional text when set', async () => {
      hostComponent.optional = true;
      hostFixture.detectChanges();

      const formField = await loader.getHarness(MatFormFieldHarness);
      expect(await formField.getLabel()).toContain('(optional)');
    });

    it('should apply custom class to form field', () => {
      hostComponent.className = 'custom-class';
      hostFixture.detectChanges();

      const formFieldElement = hostFixture.debugElement.query(
        By.css('mat-form-field'),
      );
      expect(formFieldElement.nativeElement.classList).toContain(
        'custom-class',
      );
    });

    it('should render input by default', async () => {
      const input = await loader.getHarness(MatInputHarness);
      expect(await input.getType()).toBe('text');
    });

    it('should render input with specified type', async () => {
      hostComponent.inputType = 'email';
      hostFixture.detectChanges();

      const input = await loader.getHarness(MatInputHarness);
      expect(await input.getType()).toBe('email');
    });

    it('should render textarea when isTextarea is true', () => {
      hostComponent.isTextarea = true;
      hostFixture.detectChanges();

      const textarea = hostFixture.debugElement.query(By.css('textarea'));
      expect(textarea).toBeTruthy();
    });

    it('should render select when isSelect is true', async () => {
      hostComponent.isSelect = true;
      hostFixture.detectChanges();

      const select = await loader.getHarness(MatSelectHarness);
      expect(select).toBeTruthy();
    });

    it('should show error message when control has errors', async () => {
      hostComponent.control.setValidators(Validators.required);
      hostComponent.control.markAsTouched();
      hostComponent.control.setValue('');
      hostFixture.detectChanges();

      const errorElement = hostFixture.debugElement.query(By.css('mat-error'));
      expect(errorElement?.nativeElement.textContent).toContain(
        'This field is required',
      );
    });
  });
});
