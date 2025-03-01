import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { merge, tap, catchError, of, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ModelUploadService } from '../../../../apps/iaimc-frontend/src/app/services/model-upload.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-model-upload',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './model-upload.component.html',
  styleUrl: './model-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelUploadComponent {
  @Output() modelUploaded = new EventEmitter<{
    url: string;
  }>();

  public files: WritableSignal<File[]> = signal([]);
  public uploading: WritableSignal<boolean> = signal(false);
  public uploadProgress: WritableSignal<{ name: string; progress: number }[]> =
    signal([]);
  previewImages: WritableSignal<{ name: string; url: string }[]> = signal([]);
  private loadedModelNames = new Set<string>();

  private completedUploads = 0;
  private totalUploads = 0;

  private uploadService = inject(ModelUploadService);
  private snackBar = inject(MatSnackBar);

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  public addFiles(newFiles: File[]): void {
    const validFiles = newFiles.filter((file) =>
      /\.(stl|step|stp)$/i.test(file.name),
    );
    const invalidFiles = newFiles.filter(
      (file) => !/\.(stl|step|stp)$/i.test(file.name),
    );

    if (invalidFiles.length > 0) {
      this.snackBar.open(
        `Invalid file type(s). Please upload files with .stl, .step, or .stp extensions.`,
        'Close',
        { duration: 3000 },
      );
    }

    const newValidFiles = validFiles.filter(
      (file) => !this.loadedModelNames.has(file.name),
    );
    if (newValidFiles.length === 0) return;

    newValidFiles.forEach((file) => this.loadedModelNames.add(file.name));
    this.files.set([...this.files(), ...newValidFiles]);

    this.uploadProgress.update((current) => [
      ...current,
      ...newValidFiles.map((file) => ({ name: file.name, progress: 0 })),
    ]);

    newValidFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        this.previewImages.update((current) => [
          ...current,
          { name: file.name, url },
        ]);
      };
      reader.readAsDataURL(file);
    });

    this.uploadFiles();
  }

  public uploadFiles(): void {
    if (this.files().length === 0) return;

    this.uploading.set(true);
    this.completedUploads = 0;
    this.totalUploads = this.files().length;

    const uploadObservables = this.files().map((file) =>
      this.uploadService.uploadFile(file, 'models').pipe(
        tap((event) => {
          if ('progress' in event) {
            this.uploadProgress.update((progressList) =>
              progressList.map((p) =>
                p.name === file.name ? { ...p, progress: event.progress } : p,
              ),
            );
          }

          if ('data' in event) {
            this.completedUploads++;
            this.modelUploaded.emit({
              url: event.data.url,
            });

            this.snackBar.open(`${file.name} uploaded successfully!`, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });

            if (this.completedUploads >= this.totalUploads) {
              this.finishUpload();
            }
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.completedUploads++;

          const errorMessage =
            err.error?.message || `Failed to upload ${file.name}.`;

          this.snackBar.open(errorMessage, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar'],
          });

          if (this.completedUploads >= this.totalUploads) {
            this.finishUpload();
          }
          return of({ error: true, name: file.name });
        }),
        finalize(() => {
          if (this.completedUploads >= this.totalUploads) {
            this.finishUpload();
          }
        }),
      ),
    );

    if (uploadObservables.length === 0) {
      this.finishUpload();
      return;
    }

    merge(...uploadObservables).subscribe();
  }

  private finishUpload(): void {
    this.clearUploadState();
    this.uploading.set(false);
  }

  public allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  public triggerFileInput(): void {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fileInput?.click();
  }

  public loadSampleModel(): void {
    this.uploadFiles();
  }

  private clearUploadState(): void {
    this.files.set([]);
    this.uploadProgress.set([]);
    this.previewImages.set([]);
    this.completedUploads = 0;
    this.totalUploads = 0;
    this.loadedModelNames.clear();
  }
}
