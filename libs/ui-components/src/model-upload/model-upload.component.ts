import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { merge, tap, catchError, of, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModelUploadService } from '../../../../apps/iaimc-frontend/src/app/services/model-upload.service';

@Component({
  selector: 'app-model-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './model-upload.component.html',
  styleUrl: './model-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelUploadComponent {
  @Output() modelUploaded = new EventEmitter<string>();
  public uploadedModels = signal<File[]>([]);
  public files: WritableSignal<File[]> = signal([]);
  public uploading: WritableSignal<boolean> = signal(false);
  public uploadProgress: WritableSignal<{ name: string; progress: number }[]> =
    signal([]);
  previewImages: WritableSignal<{ name: string; url: string }[]> = signal([]);

  private completedUploads = 0;
  private totalUploads = 0;

  constructor(private uploadService: ModelUploadService) {}

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const fileArray = Array.from(files);
      this.uploadedModels.update((prev) => [...prev, ...fileArray]);
      this.addFiles(fileArray);
      this.uploadFiles();
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
      this.uploadFiles();
    }
  }

  public addFiles(newFiles: File[]): void {
    const validFiles = newFiles.filter((file) =>
      /\.(stl|step|stp)$/i.test(file.name),
    );

    this.files.set([...this.files(), ...validFiles]);

    this.uploadProgress.update((current) => [
      ...current,
      ...validFiles.map((file) => ({ name: file.name, progress: 0 })),
    ]);

    validFiles.forEach((file) => {
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
            this.modelUploaded.emit(event.data.url);

            if (this.completedUploads >= this.totalUploads) {
              this.finishUpload();
            }
          }
        }),
        catchError((err) => {
          console.error(`Upload failed for ${file.name}`, err);
          this.completedUploads++;

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
    console.log('Loading sample model...');
  }

  private clearUploadState(): void {
    this.files.set([]);
    this.uploadProgress.set([]);
    this.previewImages.set([]);
    this.completedUploads = 0;
    this.totalUploads = 0;
  }
}
