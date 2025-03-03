import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageOverlayService {
  private readonly overlayState = signal(false);
  private readonly overlayTogglerState = signal(false);

  public isOverlayVisible() {
    return this.overlayState();
  }

  public isOverlayTogglerVisible() {
    return this.overlayTogglerState();
  }

  public overlayStateToggle() {
    this.overlayState.update((state) => !state);
  }

  public overlayTogglerStateToggle() {
    this.overlayTogglerState.update((state) => !state);
  }
}
