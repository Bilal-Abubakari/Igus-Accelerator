import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModelUploadState {
  private uploaded = signal(false);

  public markModelUploaded(): void {
    this.uploaded.set(true);
  }

  public hasUploadedModel(): boolean {
    return this.uploaded();
  }
}
