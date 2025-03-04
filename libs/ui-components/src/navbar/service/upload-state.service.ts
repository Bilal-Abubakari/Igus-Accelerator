import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadStateService {
  private hasUploaded = signal(false);

  public markFileUploaded(): void {
    this.hasUploaded.set(true);
  }

  public hasUploadedFile(): boolean {
    return this.hasUploaded();
  }
}
