import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from 'libs/ui-components/src/footer/footer.component';
import { ModelListComponent } from 'libs/ui-components/src/model-list/model-list.component';
import { StageComponent } from 'libs/ui-components/src/stage/stage.component';
import { ToolbarComponent } from 'libs/ui-components/src/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ToolbarComponent,
    ModelListComponent,
    FooterComponent,
    StageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
