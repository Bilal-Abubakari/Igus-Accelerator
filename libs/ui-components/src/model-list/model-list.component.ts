import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModelUploadComponent } from '../../../../libs/ui-components/src/model-upload/model-upload.component';
import { ModelViewerComponent } from '../../../../libs/ui-components/src/model-viewer/model-viewer.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, SlicePipe } from '@angular/common';
import { UploadedModel } from '../../../../apps/iaimc-frontend/src/app/services/types';

@Component({
  selector: 'app-model-list',
  imports: [
    ModelUploadComponent,
    MatCardModule,
    MatIconModule,
    SlicePipe,
    ModelViewerComponent,
    DatePipe,
  ],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelListComponent {
  public uploadedModels: UploadedModel[] = [];

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
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  private extractFileNameFromUrl(url: string): string {
    return url.split('/').pop() || 'Unnamed Model';
  }
}
