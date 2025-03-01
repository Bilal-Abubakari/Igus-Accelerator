import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StageComponent } from '../stage/stage.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-model-library',
  imports: [ToolbarComponent, StageComponent, FooterComponent],
  templateUrl: './model-library.component.html',
  styleUrl: './model-library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelLibraryComponent {}
