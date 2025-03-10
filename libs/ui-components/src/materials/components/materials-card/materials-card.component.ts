import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Material } from '../../store/material.model';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MaterialInfoDialogComponent } from '../material-info-dialog/material-info-dialog.component';

@Component({
  selector: 'app-materials-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIcon,
    TranslocoPipe,
  ],
  templateUrl: './materials-card.component.html',
  styleUrl: './materials-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsCardComponent {
  private readonly dialog = inject(MatDialog);
  private readonly transloco = inject(TranslocoService);
  @Input() material!: Material;
  @Input() selectedMaterialId!: string | null;
  @Input() toggleSelection!: (id: string) => void;

  public showMoreInfo(material: Material, event?: MouseEvent): void {
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

  public getMaterialDescription(material: Material): string {
    return material.highchemicalresistance
      ? this.transloco.translate('materialCard.HIGH_CHEMICAL_RESISTANCE', {
          temp: material.maxtemperature,
        })
      : this.transloco.translate('materialCard.GENERAL_PURPOSE');
  }

  protected getTolerancePercentage(shrinkage: number): number {
    return shrinkage * 100;
  }
}
