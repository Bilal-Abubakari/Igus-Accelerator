import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  LocalStorageKeys,
  LocalStorageService,
  ModelConfigurationEntity,
} from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { catchError, of, tap } from 'rxjs';
import { ModelConfigService } from '../services/model-config.service';
import { ModelViewerService } from '../services/model-viewer.service';
import { ModelListActions } from '../store/model-list.actions';
import { UploadDirectory } from '../types/model-upload.types';

type UploadProgress = {
  name: string;
  progress: number;
};

@Component({
  selector: 'app-model-upload',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslocoPipe,
  ],
  templateUrl: './model-upload.component.html',
  styleUrl: './model-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelUploadComponent {
  @Output() modelUploaded = new EventEmitter<object>();
  private readonly uploadService = inject(ModelConfigService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly modelViewerService = inject(ModelViewerService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly store = inject(Store);

  protected fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  public file: WritableSignal<File | null> = signal(null);
  public uploading = signal(false);
  public uploadProgress = signal<UploadProgress>({ name: '', progress: 0 });
  public isDragging = signal(false);
  public uploadedFileUrl = signal('');

  public onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.file.set(files[0]);
      this.uploadFile();
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.file.set(event.dataTransfer.files[0]);
      this.uploadFile();
    }
  }

  public uploadFile(): void {
    const file = this.file() as File;

    this.uploading.set(true);
    this.uploadProgress.set({ name: file.name, progress: 0 });

    this.uploadService
      .uploadConfig(file, 'models' as UploadDirectory)
      .pipe(
        tap((event) => this.handleUploadProgress(file, event)),
        catchError((err: HttpErrorResponse) =>
          this.handleUploadError(file, err),
        ),
      )
      .subscribe((result) => this.handleConfigurationUploadResponse(result));
  }

  public handleConfigurationUploadResponse(_result: unknown) {
    const result = _result as UploadProgress | ModelConfigurationEntity;
    if ('material' in result) {
      this.resetUploadState();
      this.updateConfigSnapshot(result);
    }
  }

  public saveActiveConfig(id: string) {
    this.localStorageService.setLocalItem(LocalStorageKeys.ACTIVE_CONFIG, id);
  }

  public async updateConfigSnapshot({ id, file }: ModelConfigurationEntity) {
    this.saveActiveConfig(id);
    const modelUrl = file.url;
    const snapshot = await this.handleSnapshotGeneration(modelUrl);
    this.uploadService
      .updateConfigSnapshot(snapshot, this.handleFailedConfigSnapshotUpdate)
      ?.subscribe({
        next: (updatedConfig) => {
          this.store.dispatch(
            ModelListActions.addModel({
              model: updatedConfig as ModelConfigurationEntity,
            }),
          );
          this.modelUploaded.emit(updatedConfig as ModelConfigurationEntity);
        },
        error: () => {
          this.handleFailedConfigSnapshotUpdate();
        },
      });
  }

  public handleFailedConfigSnapshotUpdate() {
    this.showSnackbar('Failed to update config snapshot', 'error-snackbar');
  }

  public async handleSnapshotGeneration(modelUrl: string): Promise<string> {
    this.uploadedFileUrl.set(modelUrl);
    return (await this.modelViewerService.getCanvasOutput(
      modelUrl,
      true,
    )) as string;
  }

  public handleUploadProgress(
    file: File,
    event: ModelConfigurationEntity | UploadProgress,
  ): void {
    if ('progress' in event) {
      this.uploadProgress.update(() => ({
        name: file.name,
        progress: event.progress,
      }));
    } else if ('material' in event) {
      this.showSnackbar(
        `${file.name} uploaded successfully!`,
        'success-snackbar',
      );
    }
  }

  private handleUploadError(file: File, err: HttpErrorResponse) {
    const errorMessage = err.error?.message || `Failed to upload ${file.name}.`;
    this.showSnackbar(errorMessage, 'error-snackbar');
    this.resetUploadState();
    return of({ error: true, name: file.name });
  }

  private resetUploadState(): void {
    this.uploading.set(false);
    this.clearFileInput();
  }

  private showSnackbar(message: string, panelClass = '') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
    });
  }

  public allowDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    this.isDragging.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  public triggerFileInput(): void {
    this.fileInput()?.nativeElement.click();
  }

  private clearFileInput(): void {
    const fileInput = this.fileInput()?.nativeElement;
    if (fileInput) fileInput.value = '';
  }
}
