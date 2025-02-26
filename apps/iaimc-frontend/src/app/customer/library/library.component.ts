import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-library',
  imports: [CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
