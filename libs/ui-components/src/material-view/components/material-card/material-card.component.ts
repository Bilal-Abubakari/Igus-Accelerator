import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MaterialSelectors } from '../../store/material.selectors';
import { MaterialActions } from '../../store/material.actions';
import { Material } from '../../store/material.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MaterialInfoDialogComponent } from '../material-info-dialog/material-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-material-card',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIcon,
    TranslocoPipe,
  ],
  templateUrl: './material-card.component.html',
  styleUrl: './material-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialCardComponent implements OnInit {
  protected readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  public readonly materials = this.store.selectSignal(
    MaterialSelectors.selectAllMaterials,
  );
  public readonly loading = this.store.selectSignal(
    MaterialSelectors.selectLoading,
  );
  public readonly error = this.store.selectSignal(
    MaterialSelectors.selectError,
  );
  public readonly selectedMaterialId = this.store.selectSignal(
    MaterialSelectors.selectSelectedMaterialId,
  );

  public readonly hasError: Signal<boolean> = computed(() => !!this.error());

  public readonly selectedMaterial = computed(() => {
    const selectedId = this.selectedMaterialId();
    return (
      this.materials().find((material) => material.id === selectedId) || null
    );
  });

  ngOnInit(): void {
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  public toggleSelection(materialId: string): void {
    this.store.dispatch(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );

    const selectedMaterial = this.materials().find((m) => m.id === materialId);
    if (selectedMaterial) {
      /*todo*/
      // this.applyMaterialToModel(selectedMaterial);
    }
  }

  public showMoreInfo(material: Material, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.dialog.open(MaterialInfoDialogComponent, {
      panelClass: 'fullscreen-dialog',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: material,
    });
  }

  protected getMaterialDescription(material: Material): string {
    return material.highchemicalresistance
      ? `Food material with high media resistance up to ${material.maxtemperature}°C.`
      : 'General-purpose material.';
  }

  protected getTolerancePercentage(shrinkage: number): number {
    return shrinkage * 100;
  }
}
