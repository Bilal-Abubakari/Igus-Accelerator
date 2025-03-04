import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ModelUploadComponent } from '../../../../libs/ui-components/src/model-upload/model-upload.component';
import { ModelViewerComponent } from '../../../../libs/ui-components/src/model-viewer/model-viewer.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, SlicePipe } from '@angular/common';
import {
  LocalStorageService,
  LocalStorageKeys,
} from '../model-upload/services/local-storage.service';
import { TranslocoPipe } from '@jsverse/transloco';

interface UploadedModel {
  id: string;
  url: string;
  name: string;
  material: string;
  uploadDate: string;
}

export interface FetchModelsResponse {
  data: UploadedModel[];
}

@Component({
  selector: 'app-model-list',
  imports: [
    ModelUploadComponent,
    MatCardModule,
    MatIconModule,
    SlicePipe,
    ModelViewerComponent,
    DatePipe,
    TranslocoPipe,
  ],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelListComponent implements OnInit {
  private storageService = inject(LocalStorageService);
  public uploadedModels: UploadedModel[] = [];

  ngOnInit(): void {
    this.loadModelsFromStorage();
  }

  public get modelUrls(): string[] {
    return this.uploadedModels.map((m) => m.url);
  }

  public onModelUploaded(data: { url: string }): void {
    const modelName = this.extractFileNameFromUrl(data.url);
    const newModel: UploadedModel = {
      id: this.generateUniqueId(),
      url: data.url,
      name: modelName,
      material: 'iglidur® P210',
      uploadDate: new Date().toISOString(),
    };

    this.uploadedModels = [...this.uploadedModels, newModel];
    this.saveModelsToStorage();
  }

  public removeModel(modelId: string): void {
    this.uploadedModels = this.uploadedModels.filter(
      (model) => model.id !== modelId,
    );
    this.saveModelsToStorage();
  }

  private loadModelsFromStorage(): void {
    const storedModels = this.storageService.getLocalItem<UploadedModel[]>(
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

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  private extractFileNameFromUrl(url: string | undefined): string {
    return url ? url.split('/').pop() || 'Unnamed Model' : 'Unnamed Model';
  }
}
