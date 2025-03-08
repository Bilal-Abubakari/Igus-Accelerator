import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialCardComponent } from '../../../../../../../../libs/ui-components/src/material-view/components/material-card/material-card.component';

@Component({
  selector: 'app-configuration',
  imports: [MaterialCardComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent {}
