import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LocalStorageKeys, LocalStorageService, ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { Store } from '@ngrx/store';
import { ModelListActions } from '../../../../store/model-list.actions';
import { NAVIGATION_ROUTES } from '../../../../../navbar/constants';

@Component({
  selector: 'app-model-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './model-card.component.html',
  styleUrls: ['./model-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelCardComponent implements OnInit {
  private readonly localStorageStorage = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  public isActiveConfig = signal(false);
  public relativeUploadedTime = signal('');

  @Input() modelConfiguration!: ModelConfigurationEntity;

  ngOnInit(): void {
    this.checkForActiveConfig();
    this.calculateRelativeUploadedTime();
  }

  public checkForActiveConfig() {
    const activeConfigId = this.localStorageStorage.getLocalItem(LocalStorageKeys.ACTIVE_CONFIG);
    this.isActiveConfig.set(activeConfigId === this.modelConfiguration.id);
  }

  public async setActiveConfig() {
    this.localStorageStorage.setLocalItem(LocalStorageKeys.ACTIVE_CONFIG, this.modelConfiguration.id);
    this.store.dispatch(ModelListActions.setUploadStatus({ hasModelUploaded: true }));
    await this.router.navigate([NAVIGATION_ROUTES.MOLDING_CONFIGURATION]);
  }

  public calculateRelativeUploadedTime() {
    const isoDateString = this.modelConfiguration.createdAt;
    const date = new Date(isoDateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    switch (true) {
      case seconds < 60:
        this.relativeUploadedTime.set('now');
        break;
      case minutes < 60:
        this.relativeUploadedTime.set(`${minutes}m ago`);
        break;
      case hours < 24:
        this.relativeUploadedTime.set(`${hours}hr ago`);
        break;
      case days < 7:
        this.relativeUploadedTime.set(`${days}d ago`);
        break;
      case weeks < 4:
        this.relativeUploadedTime.set(`${weeks}w ago`);
        break;
      default:
        this.relativeUploadedTime.set('last month');
    }
  }
}


// import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { Router } from '@angular/router';
// import { LocalStorageKeys, LocalStorageService, ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
// import { Store } from '@ngrx/store';
// import { ModelListActions } from '../../../../store/model-list.actions';
// import { NAVIGATION_ROUTES } from '../../../../../navbar/constants';

// @Component({
//   selector: 'app-model-card',
//   imports: [MatIconModule],
//   templateUrl: './model-card.component.html',
//   styleUrl: './model-card.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ModelCardComponent implements OnInit {
//   private readonly localStorageStorage = inject(LocalStorageService);
//   private readonly router = inject(Router);
//   private readonly store = inject(Store);

//   public isActiveConfig = signal(false);
//   public relativeUploadedTime = signal('');

//   @Input() modelConfiguration!: ModelConfigurationEntity;

//   ngOnInit(): void {
//     this.checkForActiveConfig();
//     this.calculateRelativeUploadedTime()
//   }

//   public checkForActiveConfig() {
//     const activeConfigId = this.localStorageStorage.getLocalItem(LocalStorageKeys.ACTIVE_CONFIG);
//     if (activeConfigId && activeConfigId === this.modelConfiguration.id) {
//       this.isActiveConfig.set(true)
//     }
//     else {
//       this.isActiveConfig.set(false)
//     }
//   }

//   public async setActiveConfig() {
//     this.localStorageStorage.setLocalItem(LocalStorageKeys.ACTIVE_CONFIG, this.modelConfiguration.id);
//     this.store.dispatch(ModelListActions.setUploadStatus({ hasModelUploaded: true }));
//     await this.router.navigate([NAVIGATION_ROUTES.MOLDING_CONFIGURATION]);
//   }

//   public calculateRelativeUploadedTime() {
//     const isoDateString = this.modelConfiguration.createdAt;
//     const date = new Date(isoDateString);
//     const now = new Date();
//     const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);
//     const weeks = Math.floor(days / 7);

//     switch (true) {
//       case seconds < 60:
//         this.relativeUploadedTime.set('now');
//         break;
//       case minutes < 60:
//         this.relativeUploadedTime.set(`${minutes}m ago`);
//         break;
//       case hours < 24:
//         this.relativeUploadedTime.set(`${hours}hr ago`);
//         break;
//       case days < 7:
//         this.relativeUploadedTime.set(`${days}d ago`);
//         break;
//       case weeks < 4:
//         this.relativeUploadedTime.set(`${weeks}w ago`);
//         break;
//       default:
//         this.relativeUploadedTime.set('last month');
//     }
//   }
// }

