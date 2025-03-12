import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-molding-configuration',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './molding-configuration.component.html',
  styleUrl: './molding-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoldingConfigurationComponent {}
