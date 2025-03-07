import { Injectable, computed, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ModelUploadState } from 'libs/ui-components/src/model/components/model-upload/services/model-upload-state.service';

@Injectable({ providedIn: 'root' })
export class ModelUploadGuard implements CanActivate {
  private modelUploadstate = inject(ModelUploadState);
  private router = inject(Router);

  public canActivate(): boolean {
    const hasUploadedModel = computed(() =>
      this.modelUploadstate.hasUploadedModel(),
    )();

    if (!hasUploadedModel) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
