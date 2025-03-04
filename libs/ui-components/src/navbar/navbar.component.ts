import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NAVIGATION_ROUTES } from './constants';
import { TranslocoPipe } from '@jsverse/transloco';
import { UploadStateService } from './service/upload-state.service';

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
  private uploadState = inject(UploadStateService);

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

  public isMenuOpened = signal(false);

  public hasUploadedFile = computed(() => this.uploadState.hasUploadedFile());

  public toggleMenu(): void {
    this.isMenuOpened.set(!this.isMenuOpened());
  }
}
