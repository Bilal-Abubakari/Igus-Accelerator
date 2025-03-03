import { TestBed } from '@angular/core/testing';
import { LanguageOverlayService } from './language-overlay.service';

describe('LanguageOverlayService', () => {
  let service: LanguageOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for initial overlay visibility state', () => {
    expect(service.isOverlayVisible()).toBe(false);
  });

  it('should toggle the overlay state', () => {
    service.overlayStateToggle();
    expect(service.isOverlayVisible()).toBe(true);
    service.overlayStateToggle();
    expect(service.isOverlayVisible()).toBe(false);
  });

  it('should return false for the  initial overlay toggler visibility state', () => {
    expect(service.isOverlayTogglerVisible()).toBe(false);
  });

  it('should toggle the overlay toggler state', () => {
    service.overlayTogglerStateToggle();
    expect(service.isOverlayTogglerVisible()).toBe(true);
    service.overlayTogglerStateToggle();
    expect(service.isOverlayTogglerVisible()).toBe(false);
  });
});
