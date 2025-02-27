import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModelUploadComponent } from 'libs/ui-components/src/model-upload/model-upload.component';

import { ModelsActions } from './customer/store/model-upload/model-upload.actions';

@Component({
  selector: 'app-root',
  imports: [ModelUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'Welcome iaimc-frontend';

  private readonly store = inject(Store);

  public onFileUploaded(file: File): void {
    this.store.dispatch(ModelsActions.uploadModel({ file }));
  }
}
