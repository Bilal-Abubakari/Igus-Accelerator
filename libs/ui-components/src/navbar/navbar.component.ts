import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NAVIGATION_ROUTES } from './constants';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit {
  private homeTabRef = viewChild<ElementRef>('homeTab');
  private configurationsTabRef = viewChild<ElementRef>('configurationsTab');
  private producibilityTabRef = viewChild<ElementRef>('producibilityTab');

  protected isHomeRouteActive = signal(true);
  protected homeRoute = signal(NAVIGATION_ROUTES['HOME']);
  protected configurationsRoute = signal(NAVIGATION_ROUTES['CONFIGURATIONS']);
  protected producibilityRoute = signal(NAVIGATION_ROUTES['PRODUCIBILITY']);
  private observer?: MutationObserver;
  protected isMenuOpened = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpened.set(!this.isMenuOpened());
  }

  ngAfterViewInit(): void {
    this.observer = new MutationObserver(() => {
      if (this.homeTabRef()?.nativeElement.classList.contains('active'))
        this.isHomeRouteActive.set(true);
      else if (
        this.configurationsTabRef()?.nativeElement.classList.contains('active')
      )
        this.isHomeRouteActive.set(false);
      else if (
        this.producibilityTabRef()?.nativeElement.classList.contains('active')
      )
        this.isHomeRouteActive.set(false);
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
  }
}
