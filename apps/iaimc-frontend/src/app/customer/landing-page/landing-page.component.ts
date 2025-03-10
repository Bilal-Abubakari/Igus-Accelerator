import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StageComponent ,MaterialSelectionComponent} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { ModelUploadComponent } from '../../../../../../libs/ui-components/src/model/components/model-upload/model-upload.component';

@Component({
  selector: 'app-landing-page',
  imports: [StageComponent, ModelUploadComponent,MaterialSelectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
