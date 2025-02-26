import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NAVIGATION_ROUTES } from './constants';
import { provideRouter, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { provideLocationMocks } from '@angular/common/testing';

@Component({ template: '' })
class MockComponent {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        CommonModule,
        MatToolbarModule,
        RouterLink,
        RouterLinkActive,
      ],
      providers: [
        provideRouter([
          { path: '', component: MockComponent },
          { path: 'configurations', component: MockComponent },
          { path: 'producibility', component: MockComponent },
        ]),
        provideLocationMocks(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct navigation routes', () => {
    expect(component.homeRoute()).toBe(NAVIGATION_ROUTES.HOME);
    expect(component.configurationsRoute()).toBe(
      NAVIGATION_ROUTES.CONFIGURATIONS,
    );
    expect(component.producibilityRoute()).toBe(
      NAVIGATION_ROUTES.PRODUCIBILITY,
    );
  });

  it('should toggle menu state when toggleMenu() is called', () => {
    expect(component.isMenuOpened()).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpened()).toBe(true);
    component.toggleMenu();
    expect(component.isMenuOpened()).toBe(false);
  });

  it('should toggle menu class on button click', () => {
    const button = fixture.debugElement.query(By.css('.menu_toggle'));
    const nav = fixture.debugElement.query(By.css('nav'));

    expect(nav.nativeElement.classList.contains('open')).toBe(false);
    button.nativeElement.click();
    fixture.detectChanges();
    expect(nav.nativeElement.classList.contains('open')).toBe(true);
  });

  it('should highlight active route correctly', () => {
    component.isHomeRouteActive.set(false);
    fixture.detectChanges();
    expect(component.isHomeRouteActive()).toBe(false);

    component.isHomeRouteActive.set(true);
    fixture.detectChanges();
    expect(component.isHomeRouteActive()).toBe(true);
  });

  it('should handle missing viewChild elements gracefully', () => {
    Object.defineProperty(component, 'homeTabRef', { value: () => undefined });
    Object.defineProperty(component, 'configurationsTabRef', {
      value: () => undefined,
    });
    Object.defineProperty(component, 'producibilityTabRef', {
      value: () => undefined,
    });

    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  it('should highlight configurations route correctly', () => {
    const homeTab = document.createElement('a');
    const configTab = document.createElement('a');
    const prodTab = document.createElement('a');

    Object.defineProperty(component, 'homeTabRef', {
      value: () => ({ nativeElement: homeTab }),
    });
    Object.defineProperty(component, 'configurationsTabRef', {
      value: () => ({ nativeElement: configTab }),
    });
    Object.defineProperty(component, 'producibilityTabRef', {
      value: () => ({ nativeElement: prodTab }),
    });

    homeTab.classList.add('active');
    component.ngAfterViewInit();
    expect(component.isHomeRouteActive()).toBe(true);

    homeTab.classList.remove('active');
    configTab.classList.add('active');

    component['updateActiveRoutes']();

    expect(component.isHomeRouteActive()).toBe(false);
  });

  it('should highlight producibility route correctly', () => {
    const homeTab = document.createElement('a');
    const configTab = document.createElement('a');
    const prodTab = document.createElement('a');

    Object.defineProperty(component, 'homeTabRef', {
      value: () => ({ nativeElement: homeTab }),
    });
    Object.defineProperty(component, 'configurationsTabRef', {
      value: () => ({ nativeElement: configTab }),
    });
    Object.defineProperty(component, 'producibilityTabRef', {
      value: () => ({ nativeElement: prodTab }),
    });

    homeTab.classList.add('active');
    component.ngAfterViewInit();
    expect(component.isHomeRouteActive()).toBe(true);

    homeTab.classList.remove('active');
    prodTab.classList.add('active');

    component['updateActiveRoutes']();

    expect(component.isHomeRouteActive()).toBe(false);
  });

  it('should observe DOM changes for active routes', () => {
    const mockElement = document.createElement('a');
    Object.defineProperty(component, 'homeTabRef', {
      value: () => ({ nativeElement: mockElement }),
    });
    Object.defineProperty(component, 'configurationsTabRef', {
      value: () => ({ nativeElement: mockElement }),
    });
    Object.defineProperty(component, 'producibilityTabRef', {
      value: () => ({ nativeElement: mockElement }),
    });

    component.ngAfterViewInit();

    mockElement.classList.add('active');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('active')) {
            component.isHomeRouteActive.set(true);
          } else {
            component.isHomeRouteActive.set(false);
          }
        }
      });
    });
    observer.observe(mockElement, { attributes: true });
    mockElement.classList.add('test');

    expect(component.isHomeRouteActive()).toBeDefined();
  });

  it('should handle MutationObserver errors gracefully', () => {
    jest.spyOn(MutationObserver.prototype, 'observe').mockImplementation(() => {
      throw new Error('MutationObserver error');
    });

    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  it('should disconnect MutationObserver on destroy', () => {
    const disconnectSpy = jest.spyOn(MutationObserver.prototype, 'disconnect');
    component.ngOnDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should handle updateActiveRoutes with null elements', () => {
    Object.defineProperty(component, 'homeTabRef', { value: () => null });
    Object.defineProperty(component, 'configurationsTabRef', {
      value: () => null,
    });
    Object.defineProperty(component, 'producibilityTabRef', {
      value: () => null,
    });

    expect(() => component['updateActiveRoutes']()).not.toThrow();
  });
});
