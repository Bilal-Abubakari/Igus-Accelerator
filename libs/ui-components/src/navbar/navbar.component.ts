import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { selectHasUploaded } from '../model-viewer/store/model-list.selectors';
import { NAVIGATION_ROUTES } from './constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    TranslocoPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly store = inject(Store);
  public readonly hasUploadedModel = this.store.selectSignal(selectHasUploaded);
  public readonly isMenuOpened = signal(false);

  public homeRoute = signal(NAVIGATION_ROUTES.LIBRARY);
  public configurationsRoute = signal([
    '/',
    NAVIGATION_ROUTES.MOLDING_CONFIGURATION,
    NAVIGATION_ROUTES.CONFIGURATIONS,
  ]);
  public producibilityRoute = signal([
    '/',
    NAVIGATION_ROUTES.MOLDING_CONFIGURATION,
    NAVIGATION_ROUTES.PRODUCIBILITY,
  ]);

 
  public toggleMenu(): void {
    this.isMenuOpened.set(!this.isMenuOpened());
  }
}
 