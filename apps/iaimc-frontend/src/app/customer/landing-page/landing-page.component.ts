import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  MaterialSelectionComponent,
  ModelUploadComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-landing-page',
  imports: [StageComponent, ModelUploadComponent, MaterialSelectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
