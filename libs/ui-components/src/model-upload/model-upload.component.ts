import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { selectModelState } from '../../../../apps/iaimc-frontend/src/app/customer/store/model-upload/model-upload.selectors';
import { ModelsActions } from '../../../../apps/iaimc-frontend/src/app/customer/store/model-upload/model-upload.actions';

const MAX_FILE_SIZE_MB = 1 * 1024 * 1024 * 1024;

@Component({
  selector: 'app-model-upload',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './model-upload.component.html',
  styleUrl: './model-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelUploadComponent {
  protected fileUploaded = output<File>();
  protected currentFile = signal<File | null>(null);
  protected uploadProgress = signal<number>(0);

  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);
  protected isLoading = this.store.selectSignal(selectModelState);

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  public onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  private handleFile(file: File): void {
    if (!this.isValidFileType(file)) {
      this.snackBar.open(
        'Invalid file type. Please upload STL or STEP files.',
        'Close',
        {
          duration: 3000,
        },
      );
      return;
    }

    if (!this.isFileSizeAcceptable(file)) {
      this.snackBar.open('File size exceeds 1GB limit.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.currentFile.set(file);
    this.uploadProgress.set(0);

    this.store.dispatch(ModelsActions.uploadModel({ file }));

    this.simulateUploadProgress();
  }

  private isValidFileType(file: File): boolean {
    const validExtensions = ['.stl', '.step', '.stp'];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf('.'));
    return validExtensions.includes(fileExtension);
  }

  private isFileSizeAcceptable(file: File): boolean {
    return file.size <= MAX_FILE_SIZE_MB;
  }

  private simulateUploadProgress(): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.uploadProgress.set(progress);
      if (progress >= 100) clearInterval(interval);
    }, 300);
  }
}
