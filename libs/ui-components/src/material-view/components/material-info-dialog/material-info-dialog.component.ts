import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
export class MaterialInfoDialogComponent implements OnInit {
  private store = inject(Store);
  private data = inject(MAT_DIALOG_DATA);

  material$ = this.store.select(
    MaterialSelectors.selectMaterialById(this.data.id),
  );

  public dialogRef = inject(MatDialogRef<MaterialInfoDialogComponent>);

  ngOnInit(): void {
    this.subscribeToMaterial();
  }

  private subscribeToMaterial(): void {
    this.material$.subscribe((material) => {
      if (!material) {
        this.dialogRef.close();
      }
    });
  }

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
