import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LocalStorageKeys, LocalStorageService, ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { Store } from '@ngrx/store';
import { ModelListActions } from '../../store/model-list.actions';
import { NAVIGATION_ROUTES } from '../../../navbar/constants';

@Component({
  selector: 'app-model-card',
  imports: [MatIconModule],
  templateUrl: './model-card.component.html',
  styleUrl: './model-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelCardComponent {
  private readonly localStorageStorage = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  @Input() modelConfiguration!: ModelConfigurationEntity;

  public async setActiveConfig() {
    this.localStorageStorage.setLocalItem(LocalStorageKeys.ACTIVE_CONFIG, this.modelConfiguration.id);
    this.store.dispatch(ModelListActions.setUploadStatus({ hasModelUploaded: true }));
    await this.router.navigate([NAVIGATION_ROUTES.MOLDING_CONFIGURATION]);
  
  }
}
