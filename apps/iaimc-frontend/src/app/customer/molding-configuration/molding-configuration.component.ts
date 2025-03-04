import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-molding-configuration',
  imports: [RouterOutlet],
  templateUrl: './molding-configuration.component.html',
  styleUrl: './molding-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoldingConfigurationComponent {}
