import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllModels,
  selectErrorFetchingModel,
  selectTriggerModelFetch,
} from '../../store/model-list.selectors';
import { ModelCardComponent } from './components/model-card/model-card.component';
import { take } from 'rxjs';
import { ModelListActions } from '../../store/model-list.actions';

@Component({
  selector: 'app-model-list',
  imports: [ModelCardComponent],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelListComponent implements OnInit{
  private readonly store = inject(Store);

  public models = this.store.selectSignal(selectAllModels);
  public errorFetchingModel = this.store.selectSignal(selectErrorFetchingModel);
  public triggerModelFetch = this.store.selectSignal(selectTriggerModelFetch);

  ngOnInit(): void {
    this.store.select(selectAllModels)
      .pipe(take(1))
      .subscribe(models => {
        if (models.length === 0 || this.triggerModelFetch()) {
          this.store.dispatch(ModelListActions.loadModelList());
        }
      });
  }
}
