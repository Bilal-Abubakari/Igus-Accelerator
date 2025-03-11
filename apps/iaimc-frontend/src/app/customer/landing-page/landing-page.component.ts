import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  MaterialSelectionComponent,
  ScheduleCallComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { ModelUploadComponent } from '../../../../../../libs/ui-components/src/model/components/model-upload/model-upload.component';
import { FooterComponent } from '../../../../../../libs/ui-components/src/landing-page/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    StageComponent,
    ModelUploadComponent,
    ScheduleCallComponent,
    FooterComponent,
    MaterialSelectionComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
