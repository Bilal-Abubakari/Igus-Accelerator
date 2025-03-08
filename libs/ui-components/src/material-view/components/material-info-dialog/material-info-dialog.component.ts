import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { MaterialSelectors } from '../../store/material.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-material-info-dialog',
  imports: [MatDialogActions, MatButton, MatDialogContent, AsyncPipe],
  templateUrl: './material-info-dialog.component.html',
  styleUrl: './material-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialInfoDialogComponent {
  private store = inject(Store);
  private data = inject(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<MaterialInfoDialogComponent>);

  material$ = this.store.select(
    MaterialSelectors.selectMaterialById(this.data.id),
  );

  getResistanceClass(resistance: string): string {
    switch (resistance) {
      case 'o':
        return 'neutral';
      case 'x':
        return 'bad';
      case '+':
        return 'good';
      default:
        return 'unknown';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
