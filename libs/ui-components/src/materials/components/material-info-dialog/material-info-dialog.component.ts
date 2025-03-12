import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { LowerCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';

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
  private readonly data = inject(MAT_DIALOG_DATA);

  public readonly dialogRef = inject(MatDialogRef<MaterialInfoDialogComponent>);
  public readonly displayedColumns = [
    'chemical',
    'resistant',
    'conditionally-resistant',
    'non-resistant',
  ];

  public readonly material = computed(
    () => this.data as InjectionMoldingMaterial,
  );

  public readonly resistantChemicals = computed(
    () => this.material()?.chemicals.filter((c) => c.resistance === '+') ?? [],
  );

  public readonly conditionallyResistantChemicals = computed(
    () => this.material()?.chemicals.filter((c) => c.resistance === 'o') ?? [],
  );

  public readonly nonResistantChemicals = computed(
    () => this.material()?.chemicals.filter((c) => c.resistance === 'x') ?? [],
  );

  public readonly dataSource = computed(() => this.material()?.chemicals ?? []);

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
