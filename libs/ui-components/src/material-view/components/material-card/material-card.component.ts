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

@Component({
  selector: 'app-material-card',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './material-card.component.html',
  styleUrl: './material-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialCardComponent implements OnInit {
  protected readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  public readonly query = {
    materials: this.store.selectSignal(MaterialSelectors.selectAllMaterials),
    loading: this.store.selectSignal(MaterialSelectors.selectLoading),
    error: this.store.selectSignal(MaterialSelectors.selectError),
  };

  public readonly hasError: Signal<boolean> = computed(
    () => !!this.query.error(),
  );

  ngOnInit(): void {
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  public toggleSelection(materialId: string): void {
    this.store.dispatch(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );
  }

  public showMoreInfo(material: Material): void {
    this.dialog.open(MaterialInfoDialogComponent, {
      panelClass: 'fullscreen-dialog',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: material,
    });
  }

  public getTolerancePercentage(tolerance: number): number {
    const maxTolerance = 2;
    return (tolerance / maxTolerance) * 100;
  }

  protected readonly MaterialSelectors = MaterialSelectors;
}
