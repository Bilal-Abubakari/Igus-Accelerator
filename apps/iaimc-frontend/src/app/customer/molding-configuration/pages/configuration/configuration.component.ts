import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialsComponent } from '../../../../../../../../libs/ui-components/src/materials/materials.component';

@Component({
  selector: 'app-configuration',
  imports: [MaterialsComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent {}
