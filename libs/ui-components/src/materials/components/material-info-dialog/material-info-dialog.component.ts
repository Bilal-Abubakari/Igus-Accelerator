import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { selectMaterialById } from '../../store/material.selectors';
import { TranslocoPipe } from '@jsverse/transloco';
import { LowerCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-material-info-dialog',
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogContent,
    TranslocoPipe,
    LowerCasePipe,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './material-info-dialog.component.html',
  styleUrl: './material-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialInfoDialogComponent {
  private readonly store = inject(Store);
  private readonly data = inject(MAT_DIALOG_DATA);
  public readonly dialogRef = inject(MatDialogRef<MaterialInfoDialogComponent>);
  public readonly displayedColumns = [
    'chemical',
    'resistant',
    'conditionally-resistant',
    'non-resistant',
  ];

  public readonly material = this.store.selectSignal(
    selectMaterialById(this.data.id),
  );

  public resistantChemicals =
    this.material()?.chemicals.filter((c) => c.resistance === '+') || [];
  public conditionallyResistantChemicals =
    this.material()?.chemicals.filter((c) => c.resistance === 'o') || [];
  public nonResistantChemicals =
    this.material()?.chemicals.filter((c) => c.resistance === 'x') || [];
  public dataSource = computed(() => this.material()?.chemicals ?? []);

  public getResistanceClass(resistance: string): string {
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

  public close(): void {
    this.dialogRef.close();
  }
}
