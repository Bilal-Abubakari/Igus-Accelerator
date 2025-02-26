import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NAVIGATION_ROUTES } from './constants';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  public homeTabRef = viewChild<ElementRef>('homeTab');
  public configurationsTabRef = viewChild<ElementRef>('configurationsTab');
  public producibilityTabRef = viewChild<ElementRef>('producibilityTab');

  public isHomeRouteActive = signal(true);
  public homeRoute = signal(NAVIGATION_ROUTES.HOME);
  public configurationsRoute = signal(NAVIGATION_ROUTES.CONFIGURATIONS);
  public producibilityRoute = signal(NAVIGATION_ROUTES.PRODUCIBILITY);

  private observer?: MutationObserver;
  public isMenuOpened = signal(false);

  public toggleMenu(): void {
    this.isMenuOpened.set(!this.isMenuOpened());
  }

  ngAfterViewInit(): void {
    try {
      if (
        this.homeTabRef() &&
        this.configurationsTabRef() &&
        this.producibilityTabRef()
      ) {
        this.observer = new MutationObserver(() => {
          this.updateActiveRoutes();
        });

        this.observer.observe(this.homeTabRef()?.nativeElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
        this.observer.observe(this.configurationsTabRef()?.nativeElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
        this.observer.observe(this.producibilityTabRef()?.nativeElement, {
          attributes: true,
          attributeFilter: ['class'],
        });

        this.updateActiveRoutes();
      }
    } catch (error) {
      console.error('Error setting up observer', error);
    }
  }

  private updateActiveRoutes(): void {
    const isHomeActive =
      this.homeTabRef()?.nativeElement.classList.contains('active') || false;
    const isConfigActive =
      this.configurationsTabRef()?.nativeElement.classList.contains('active') ||
      false;
    const isProducibilityActive =
      this.producibilityTabRef()?.nativeElement.classList.contains('active') ||
      false;

    this.isHomeRouteActive.set(
      isHomeActive && !isConfigActive && !isProducibilityActive,
    );
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
