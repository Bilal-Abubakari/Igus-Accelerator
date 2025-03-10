import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageOverlayComponent } from '../../language-switcher/components/language-overlay/language-overlay.component';
import { LanguageSwitcherComponent } from '../../language-switcher/language-switcher.component';
import { LanguageOverlayService } from '../../language-switcher/services/language-overlay/language-overlay.service';

@Component({
  selector: 'app-toolbar',
  imports: [
    CommonModule,
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    LanguageSwitcherComponent,
    LanguageOverlayComponent,
    TranslocoPipe,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  protected readonly langOverlayService = inject(LanguageOverlayService);

  protected showLangOverlayToggler = computed(() =>
    this.langOverlayService.isOverlayTogglerVisible(),
  );

  public toggleOverlay() {
    this.langOverlayService.overlayTogglerStateToggle();
  }
}
