import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  WritableSignal,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { merge, tap, catchError, of, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ModelUploadService } from './services/model-upload.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { UploadDirectory, UploadEvent } from './types';
import { ModelUploadEvent } from '../model-list/types';

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
  @Output() modelUploaded = new EventEmitter<ModelUploadEvent>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private uploadService = inject(ModelUploadService);
  private snackBar = inject(MatSnackBar);

  public files: WritableSignal<File[]> = signal([]);
  public uploading = signal(false);
  public uploadProgress = signal<{ name: string; progress: number }[]>([]);
  public isDragging = signal(false);
  public previewImages = signal<{ name: string; url: string }[]>([]);
  private loadedModelNames = new Set<string>();

  private completedUploads = 0;
  private totalUploads = 0;

  private readonly ALLOWED_EXTENSIONS = /\.(stl|step|stp)$/i;

  public onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.processFiles(Array.from(files));
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  public processFiles(newFiles: File[]): void {
    const { validFiles, invalidFiles } = this.filterFiles(newFiles);

    if (invalidFiles.length) {
      this.showSnackbar(
        `Invalid file type(s). Please upload files with .stl, .step, or .stp extensions.`,
      );
    }

    if (!validFiles.length) return;

    this.addNewFiles(validFiles);
    this.generatePreviews(validFiles);
    this.uploadFiles();
  }

  private filterFiles(files: File[]): {
    validFiles: File[];
    invalidFiles: File[];
  } {
    return {
      validFiles: files.filter(
        (file) =>
          this.ALLOWED_EXTENSIONS.test(file.name) &&
          !this.loadedModelNames.has(file.name),
      ),
      invalidFiles: files.filter(
        (file) => !this.ALLOWED_EXTENSIONS.test(file.name),
      ),
    };
  }

  private addNewFiles(files: File[]): void {
    files.forEach((file) => this.loadedModelNames.add(file.name));
    this.files.set([...this.files(), ...files]);

    this.uploadProgress.update((progress) => [
      ...progress,
      ...files.map((file) => ({ name: file.name, progress: 0 })),
    ]);
  }

  private generatePreviews(files: File[]): void {
    const previews = files.map(
      (file) =>
        new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const url = e.target?.result as string;
            this.previewImages.update((current) => [
              ...current,
              { name: file.name, url },
            ]);
            resolve();
          };
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(previews).catch(() =>
      console.error('Error generating previews'),
    );
  }

  public uploadFiles(): void {
    if (!this.files().length) return;

    this.uploading.set(true);
    this.completedUploads = 0;
    this.totalUploads = this.files().length;

    const uploadObservables = this.files().map((file) =>
      this.uploadService.uploadFile(file, 'models' as UploadDirectory).pipe(
        tap((event) => this.handleUploadProgress(file, event)),
        catchError((err: HttpErrorResponse) =>
          this.handleUploadError(file, err),
        ),
        finalize(() => this.checkUploadCompletion()),
      ),
    );

    merge(...uploadObservables).subscribe();
  }

  private handleUploadProgress(file: File, event: UploadEvent): void {
    if ('progress' in event) {
      this.uploadProgress.update((progressList) =>
        progressList.map((p) =>
          p.name === file.name ? { ...p, progress: event.progress } : p,
        ),
      );
    }

    if ('data' in event) {
      this.completedUploads++;
      const uploadEvent: ModelUploadEvent = {
        public_id: event.data.public_id,
        secure_url: event.data.secure_url,
        created_at: event.data.created_at ?? '',
        display_name: event.data.display_name,
        original_filename: event.data.original_filename,
        material: event.data.material ?? '',
        name: event.data.display_name,
      };
      this.modelUploaded.emit(uploadEvent);
      this.showSnackbar(
        `${file.name} uploaded successfully!`,
        'success-snackbar',
      );
    }
  }

  private handleUploadError(file: File, err: HttpErrorResponse) {
    this.completedUploads++;
    const errorMessage = err.error?.message || `Failed to upload ${file.name}.`;
    this.showSnackbar(errorMessage, 'error-snackbar');
    return of({ error: true, name: file.name });
  }

  private checkUploadCompletion(): void {
    if (this.completedUploads >= this.totalUploads) {
      this.finishUpload();
    }
  }

  private finishUpload(): void {
    this.clearUploadState();
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
    this.fileInput.nativeElement.click();
  }

  private clearUploadState(): void {
    this.files.set([]);
    this.uploadProgress.set([]);
    this.previewImages.set([]);
    this.loadedModelNames.clear();
    this.completedUploads = 0;
    this.totalUploads = 0;
  }

  private clearFileInput(): void {
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }
}
