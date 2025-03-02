import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  ToolbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { ModelListComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ToolbarComponent, ModelListComponent, StageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
