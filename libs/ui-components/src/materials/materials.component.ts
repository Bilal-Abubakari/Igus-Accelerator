import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  Signal,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllMaterials,
  selectLoading,
  selectError,
  selectMaterial,
  selectViewMode,
} from './store/material.selectors';
import { MaterialActions } from './store/material.actions';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MaterialsCardComponent } from './components/materials-card/materials-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { ViewMode } from './types';
import { MaterialsTableComponent } from './components/materials-table/materials-table.component';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-materials',
  imports: [
    MatProgressSpinner,
    MaterialsCardComponent,
    TranslocoPipe,
    MaterialsTableComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsComponent implements OnInit {
  private readonly store = inject(Store);

  public readonly materials = this.store.selectSignal(selectAllMaterials);
  public readonly loading = this.store.selectSignal(selectLoading);
  public readonly error = this.store.selectSignal(selectError);
  public readonly selectedMaterialId = this.store.selectSignal(selectMaterial);
  public readonly viewMode = this.store.selectSignal(selectViewMode);
  public readonly hasError: Signal<boolean> = computed(() => !!this.error());

  ngOnInit(): void {
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  public toggleSelection(materialId: string): void {
    this.store.dispatch(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );
  }

  public changeViewMode(viewMode: ViewMode): void {
    this.store.dispatch(MaterialActions.setViewMode({ viewMode }));
  }
}
