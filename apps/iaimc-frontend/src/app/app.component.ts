import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  ToolbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { ModelListComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';
import { FooterComponent } from '../../../../libs/ui-components/src/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ToolbarComponent,
    ModelListComponent,
    FooterComponent,
    StageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
