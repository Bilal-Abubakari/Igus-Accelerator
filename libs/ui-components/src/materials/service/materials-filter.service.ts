import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterOverlayService {
  private readonly activeOverlays = signal<Record<string, boolean>>({});

  public isOverlayVisible(filterName: string) {
    return this.activeOverlays()[filterName] || false;
  }

  public toggleOverlayState(filterName: string) {
    const isCurrentlyVisible = this.isOverlayVisible(filterName);

    this.closeAllOverlays();

    if (!isCurrentlyVisible) {
      this.activeOverlays.update((overlays) => ({
        ...overlays,
        [filterName]: true,
      }));
    }
  }

  public closeAllOverlays() {
    this.activeOverlays.set({});
  }
}
