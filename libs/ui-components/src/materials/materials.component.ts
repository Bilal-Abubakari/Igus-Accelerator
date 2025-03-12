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
} from './store/material.selectors';
import { MaterialActions } from './store/material.actions';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MaterialsCardComponent } from './components/materials-card/materials-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-materials',
  imports: [MatProgressSpinner, MaterialsCardComponent, TranslocoPipe],
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

  public readonly hasError: Signal<boolean> = computed(() => !!this.error());

  ngOnInit(): void {
    this.store.dispatch(MaterialActions.loadMaterials());
  }

  public toggleSelection(materialId: string, colorHex: string): void {
     console.log(`Dispatching Toggle Material Selection:`, { materialId, colorHex });
  this.store.dispatch(
    MaterialActions.toggleMaterialSelection({ materialId, colorHex }),
  );
}

}
