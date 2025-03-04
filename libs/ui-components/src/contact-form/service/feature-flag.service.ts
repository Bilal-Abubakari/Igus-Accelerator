import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private readonly flags = signal<Record<string, boolean>>({
    ...environment.featureFlags,
    ...this.loadFlagsFromStorage(),
  });

  constructor() {
    if (!environment.production) {
      window.addEventListener('storage', (event) => {
        if (event.key === 'featureFlags') {
          this.updateFlagsFromStorage();
        }
      });
    }
  }

  public isFeatureEnabled = (featureName: string) =>
    computed(() => this.flags()[featureName] ?? false);

  public toggleFeature(featureName: string): void {
    if (environment.production) return;

    this.flags.update((current) => ({
      ...current,
      [featureName]: !current[featureName],
    }));

    this.saveFlagsToStorage();
  }

  private loadFlagsFromStorage(): Record<string, boolean> {
    try {
      const savedFlags = localStorage.getItem('featureFlags');
      return savedFlags ? JSON.parse(savedFlags) : {};
    } catch (error) {
      console.error('Error loading feature flags:', error);
      return {};
    }
  }

  private saveFlagsToStorage(): void {
    try {
      localStorage.setItem('featureFlags', JSON.stringify(this.flags()));
    } catch (error) {
      console.error('Error saving feature flags:', error);
    }
  }

  private updateFlagsFromStorage(): void {
    this.flags.update((current) => ({
      ...current,
      ...this.loadFlagsFromStorage(),
    }));
  }
}
