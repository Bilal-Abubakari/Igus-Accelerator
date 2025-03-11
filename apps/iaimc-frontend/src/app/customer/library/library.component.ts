import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MainFooterComponent,
  ModelListComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { NavbarComponent } from '../../../../../../libs/ui-components/src/navbar/navbar.component';

@Component({
  selector: 'app-library',
  imports: [MainFooterComponent, ModelListComponent, NavbarComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
