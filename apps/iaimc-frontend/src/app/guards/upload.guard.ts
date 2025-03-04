import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UploadStateService } from '../../../../../libs/ui-components/src/navbar/service/upload-state.service';

@Injectable({
  providedIn: 'root',
})
export class UploadGuard implements CanActivate {
  private readonly uploadState = inject(UploadStateService);
  private router = inject(Router);

  public canActivate(): boolean {
    if (!this.uploadState.hasUploadedFile()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
