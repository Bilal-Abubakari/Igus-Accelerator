import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { MaterialInfoDialogComponent } from '../components/material-info-dialog/material-info-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class MaterialDialogService {
  private readonly dialog = inject(MatDialog);

  public openMaterialDialog(
    material: InjectionMoldingMaterial,
    event?: MouseEvent,
  ): void {
    if (event) event.stopPropagation();
    this.dialog.open(MaterialInfoDialogComponent, {
      panelClass: 'fullscreen-dialog',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: material,
    });
  }
}
