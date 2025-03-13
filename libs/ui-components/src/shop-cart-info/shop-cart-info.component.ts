import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReusableButtonComponent } from '../reusable-components/reusable-button/reusable-button.component';

@Component({
  selector: 'app-shop-cart-info',
  imports: [
    CommonModule,
    FormsModule,
    MatInput,
    TranslocoPipe,
    ReusableButtonComponent,
  ],
  templateUrl: './shop-cart-info.component.html',
  styleUrl: './shop-cart-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCartInfoComponent {
  @Input() price = 0;
  @Input() currencyCode = 'USD';

  quantity = 1;

  submitRequest() {
    console.log(this.price);
  }
}
