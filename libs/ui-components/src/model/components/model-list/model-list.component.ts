import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ModelUploadComponent } from '../model-upload/model-upload.component';
import { ModelViewerComponent } from '../model-viewer/model-viewer.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, SlicePipe } from '@angular/common';
import { ModelUploadEvent } from './types';
import {
  LocalStorageKeys,
  LocalStorageService,
} from '../model-upload/services/local-storage.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-model-list',
  imports: [
    ModelUploadComponent,
    MatCardModule,
    ModelViewerComponent,
    TranslocoPipe,
    MatIconModule,
    DatePipe,
    SlicePipe,
  ],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelListComponent implements OnInit {
  private storageService = inject(LocalStorageService);
  public uploadedModels: ModelUploadEvent[] = [];

  ngOnInit(): void {
    this.loadModelsFromStorage();
  }

  public get modelUrls(): string[] {
    return this.uploadedModels.map((m) => m.secure_url);
  }

  public onModelUploaded(uploadEvent: ModelUploadEvent): void {
    const newModel: ModelUploadEvent = {
      ...uploadEvent,
      name: uploadEvent.display_name || uploadEvent.original_filename,
      material: 'iglidur® P210',
    };

    this.uploadedModels = [...this.uploadedModels, newModel];
    this.saveModelsToStorage();
  }

  public removeModel(modelId: string): void {
    this.uploadedModels = this.uploadedModels.filter(
      (model) => model.public_id !== modelId,
    );
    this.saveModelsToStorage();
  }

  private loadModelsFromStorage(): void {
    const storedModels = this.storageService.getLocalItem<ModelUploadEvent[]>(
      LocalStorageKeys.UPLOADED_MODELS,
    );
    if (storedModels && Array.isArray(storedModels)) {
      this.uploadedModels = storedModels;
    }
  }

  private saveModelsToStorage(): void {
    this.storageService.setLocalItem(
      LocalStorageKeys.UPLOADED_MODELS,
      this.uploadedModels,
    );
  }
}
