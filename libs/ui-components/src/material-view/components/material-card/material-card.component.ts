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
import { TolerancePercentagePipe } from '../../../pipes/tolerance.pipe';

@Component({
  selector: 'app-material-card',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIcon,
    TolerancePercentagePipe,
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

  public readonly selectedMaterials = computed(() => {
    const selectedId = this.selectedMaterialId();
    return this.materials().map((material) => ({
      ...material,
      isSelected: selectedId === material.id,
      description: this.getMaterialDescription(material),
      tolerancePercentage: this.getTolerancePercentage(material.shrinkage),
    }));
  });

  ngOnInit(): void {
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  public toggleSelection(materialId: string): void {
    this.store.dispatch(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );
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
  public lightenColor(hex: string, percent: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Lighten the color
    r = Math.min(255, r + (255 - r) * (percent / 100));
    g = Math.min(255, g + (255 - g) * (percent / 100));
    b = Math.min(255, b + (255 - b) * (percent / 100));

    // Convert back to hex
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }
  private getMaterialDescription(material: Material): string {
    return material.highchemicalresistance
      ? `Food material with high media resistance up to ${material.maxtemperature}°C.`
      : 'General-purpose material.';
  }

  private getTolerancePercentage(shrinkage: number): number {
    return shrinkage * 100;
  }
}
