import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public homeRoute = signal(NAVIGATION_ROUTES.HOME);
  public configurationsRoute = signal(NAVIGATION_ROUTES.CONFIGURATIONS);
  public producibilityRoute = signal(NAVIGATION_ROUTES.PRODUCIBILITY);

  public isMenuOpened = signal(false);

  public toggleMenu(): void {
    this.isMenuOpened.set(!this.isMenuOpened());
  }
}
