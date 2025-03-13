import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  public readonly price = 0;
  public readonly quantity = 1;
}
