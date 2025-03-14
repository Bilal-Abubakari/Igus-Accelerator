import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { LanguageOverlayService } from '../../language-switcher/services/language-overlay/language-overlay.service';
import { ToolbarComponent } from './toolbar.component';
import { getTranslocoModule } from '../../transloco-test-config/transloco-testing.module';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let languageOverlayService: LanguageOverlayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatToolbarModule, getTranslocoModule()],
      providers: [LanguageOverlayService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    languageOverlayService = TestBed.inject(LanguageOverlayService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should toggle the language overlay when toggleOverlay is called', () => {
    jest.spyOn(languageOverlayService, 'overlayTogglerStateToggle');

    component.toggleOverlay();

    expect(
      languageOverlayService.overlayTogglerStateToggle,
    ).toHaveBeenCalledTimes(1);
  });

  it('should initialize with the correct showLangOverlayToggler value', () => {
    jest
      .spyOn(languageOverlayService, 'isOverlayTogglerVisible')
      .mockReturnValue(false);

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['showLangOverlayToggler']()).toBe(false);
  });

  it('should include the language switcher component when menu is visible', () => {
    jest
      .spyOn(languageOverlayService, 'isOverlayTogglerVisible')
      .mockReturnValue(true);
    fixture.detectChanges();

    const langSwitcher = fixture.debugElement.query(
      By.css('app-lang-switcher'),
    );
    expect(langSwitcher).toBeTruthy();
  });

  it('should include the language overlay component', () => {
    const langOverlay = fixture.debugElement.query(By.css('app-lang-overlay'));
    expect(langOverlay).toBeTruthy();
  });

  it('should not display the language switcher menu when showLangOverlayToggler is false', () => {
    jest
      .spyOn(languageOverlayService, 'isOverlayTogglerVisible')
      .mockReturnValue(false);
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('menu'));
    expect(menuElement.classes).not.toContain('visible');
  });

  it('should display the signup, login, and menu buttons', () => {
    const signinButton = fixture.debugElement.query(
      By.css('.header-toolbar__primary__btn'),
    ).parent?.nativeElement;
    const signUpButton = fixture.debugElement.query(
      By.css('.header-toolbar__secondary__btn'),
    ).parent?.nativeElement;
    const langSwitcherButton = fixture.debugElement.query(
      By.css('.header-toolbar__lang__switcher '),
    ).parent?.nativeElement;

    expect(signinButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(langSwitcherButton).toBeTruthy();
  });

  it('should display the hamburger menu button on smaller screens', () => {
    const hamburgerMenuButtonDebugElement = fixture.debugElement.query(
      By.css('.humberger__menu button mat-icon[fontIcon="menu"]'),
    );
    const hamburgerMenuButton = hamburgerMenuButtonDebugElement
      ? hamburgerMenuButtonDebugElement.parent?.nativeElement
      : null;
    expect(hamburgerMenuButton).toBeTruthy();
  });
});
