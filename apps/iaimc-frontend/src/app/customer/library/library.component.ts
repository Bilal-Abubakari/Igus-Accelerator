import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  FooterComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { ModelListComponent } from '../../../../../../libs/ui-components/src/model-list/model-list.component';

@Component({
  selector: 'app-library',
  imports: [CommonModule, StageComponent, FooterComponent, ModelListComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
