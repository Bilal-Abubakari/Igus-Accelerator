import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialsComponent } from '../../../../../../../../libs/ui-components/src/materials/materials.component';
import { ConfigInformationComponent } from '../../../../../../../../libs/ui-components/src/config-information/config-information.component';

@Component({
  selector: 'app-configuration',
  imports: [MaterialsComponent, ConfigInformationComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent {}
