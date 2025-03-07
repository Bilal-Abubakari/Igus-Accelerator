import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { NAVIGATION_ROUTES } from './constants';
import { TranslocoPipe } from '@jsverse/transloco';
import { ModelUploadState } from '../model/components/model-upload/services/model-upload-state.service';

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
  private modelUploadState = inject(ModelUploadState);

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

  public hasUploadedModel = computed(() =>
    this.modelUploadState.hasUploadedModel(),
  );

  public toggleMenu(): void {
    this.isMenuOpened.set(!this.isMenuOpened());
  }
}
