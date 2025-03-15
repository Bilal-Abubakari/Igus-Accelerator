import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgClass, NgStyle, PercentPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MATERIAL_COLUMNS } from '../../types';
import { MaterialDialogService } from '../../service/material-dialog.service';
import { tolerancePercentage } from '../../../utilities/materials.utils';

@Component({
  selector: 'app-materials-table',
  imports: [
    MatTableModule,
    TranslocoPipe,
    PercentPipe,
    MatProgressBar,
    MatIconButton,
    MatIcon,
    NgStyle,
    NgClass,
    TranslocoPipe,
  ],
  templateUrl: './materials-table.component.html',
  styleUrl: './materials-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsTableComponent {
  @Input() materials: InjectionMoldingMaterial[] = [];

  private readonly materialDialogService = inject(MaterialDialogService);
  public selectedMaterial: InjectionMoldingMaterial | null = null;
  public readonly displayedColumns: string[] = MATERIAL_COLUMNS;
  public selectedMaterialId: string | null = null;

  public getTolerancePercentage(shrinkage: number): number {
    return tolerancePercentage(shrinkage);
  }

  public showMoreInfo(
    material: InjectionMoldingMaterial,
    event?: MouseEvent,
  ): void {
    this.selectedMaterial = material;
    this.materialDialogService.openMaterialDialog(material, event);
  }

  public toggleSelection(materialId: string): void {
    this.selectedMaterialId =
      this.selectedMaterialId === materialId ? null : materialId;
  }
}
