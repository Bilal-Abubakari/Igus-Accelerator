import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialsComponent } from '../../../../../../../../libs/ui-components/src/materials/materials.component';
import { ShopCartInfoComponent } from '../../../../../../../../libs/ui-components/src/shop-cart-info/shop-cart-info.component';

@Component({
  selector: 'app-configuration',
  imports: [MaterialsComponent, ShopCartInfoComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent {}
