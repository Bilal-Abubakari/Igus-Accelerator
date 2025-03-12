import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ModelListActions } from '../store/model-list.actions';
import {
  selectAllModels,
  selectErrorFetchingModel,
  selectTriggerModelFetch,
} from '../store/model-list.selectors';
import { ModelCardComponent } from './model-card/model-card.component';

@Component({
  selector: 'app-model-list',
  imports: [ModelCardComponent],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelListComponent implements OnInit {
  private readonly store = inject(Store);

  public models = this.store.selectSignal(selectAllModels);
  public errorFetchingModel = this.store.selectSignal(selectErrorFetchingModel);
  public triggerModelFetch = this.store.selectSignal(selectTriggerModelFetch);

  ngOnInit() {
    this.store.dispatch(ModelListActions.loadModelList());
  }
}
