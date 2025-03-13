import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReusableButtonComponent } from '../reusable-components/reusable-button/reusable-button.component';
import { ReusableFormFieldComponent } from '../reusable-components/reusable-form-field/reusable-form-field.component';
import { DEFAULT_ERROR_MESSAGES } from '../utilities/error-messages';

@Component({
  selector: 'app-shop-cart-info',
  imports: [
    CommonModule,
    FormsModule,
    MatInput,
    TranslocoPipe,
    ReusableButtonComponent,
    ReusableFormFieldComponent,
    MatLabel,
    MatFormField,
  ],
  templateUrl: './shop-cart-info.component.html',
  styleUrl: './shop-cart-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCartInfoComponent implements OnInit {
  public readonly customErrorMessages = DEFAULT_ERROR_MESSAGES;
  public readonly price = -1;
  public quantity: number | null = 1;
  public quantityControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);

  ngOnInit() {
    this.quantityControl.valueChanges.subscribe((value) => {
      this.quantity = value;
    });
  }
}
