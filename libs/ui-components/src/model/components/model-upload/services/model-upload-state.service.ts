import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class ModelUploadState {
  private readonly localStorageService = inject(LocalStorageService);

  private uploaded = signal<boolean>(
    this.localStorageService.getLocalItem<boolean>(
      LocalStorageKeys.HAS_UPLOADED_MODEL,
    ) ?? false,
  );

  public markModelUploaded(): void {
    this.uploaded.set(true);
    this.localStorageService.setLocalItem(
      LocalStorageKeys.HAS_UPLOADED_MODEL,
      true,
    );
  }

  public hasUploadedModel(): boolean {
    return this.uploaded();
  }

  public clearUploadedModel(): void {
    this.uploaded.set(false);
    this.localStorageService.removeItem(LocalStorageKeys.HAS_UPLOADED_MODEL);
  }
}
