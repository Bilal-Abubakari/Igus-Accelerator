import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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
  private readonly translocoService = inject(TranslocoService);
  public readonly price = -1;

  public readonly buttonStyles = {
    backgroundColor: 'var(--mat-sys-on-primary-container)',
    color: 'white',
    borderRadius: '12px',
    height: '45px',
    width: '150px',
  };

  public quantityControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);

  public readonly errorMessages = {
    min: this.translocoService.translate('cartInfo.MIN_ERROR'),
  };
}
