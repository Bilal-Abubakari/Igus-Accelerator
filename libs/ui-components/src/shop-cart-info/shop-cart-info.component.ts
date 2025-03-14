import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReusableButtonComponent } from '../reusable-components/reusable-button/reusable-button.component';
import { ReusableFormFieldComponent } from '../reusable-components/reusable-form-field/reusable-form-field.component';

@Component({
  selector: 'app-shop-cart-info',
  imports: [
    CommonModule,
    FormsModule,
    TranslocoPipe,
    ReusableButtonComponent,
    ReusableFormFieldComponent,
  ],
  templateUrl: './shop-cart-info.component.html',
  styleUrl: './shop-cart-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCartInfoComponent {
  public readonly price = -1;

  public quantityControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);

  public readonly errorMessages = {
    min: 'Value must not be below 1',
  };
}
