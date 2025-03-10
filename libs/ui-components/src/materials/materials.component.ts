import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  Signal,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MaterialSelectors } from './store/material.selectors';
import { MaterialActions } from './store/material.actions';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MaterialsCardComponent } from './components/materials-card/materials-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinner, MaterialsCardComponent, TranslocoPipe],
})
export class MaterialsComponent implements OnInit {
  private readonly store = inject(Store);

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

  ngOnInit(): void {
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  public toggleSelection(materialId: string): void {
    this.store.dispatch(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );
  }
}
