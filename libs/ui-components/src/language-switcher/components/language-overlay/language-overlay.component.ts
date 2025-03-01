import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AVAILABLE_LANGUAGES } from '../../constants';
import { LanguageOverlayService } from '../../services/language-overlay/language-overlay.service';
import { LanguageCode } from '../../types';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lang-overlay',
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
  ],
  templateUrl: './language-overlay.component.html',
  styleUrl: './language-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageOverlayComponent {
  protected readonly langOverlayService = inject(LanguageOverlayService);
  private readonly translocoService = inject(TranslocoService);

  protected availableLanguages = signal(AVAILABLE_LANGUAGES);

  public toggleLanguageOverlay() {
    this.langOverlayService.overlayStateToggle();
  }

  protected switchLanguage(lang: LanguageCode) {
    this.translocoService.setActiveLang(lang);
    this.langOverlayService.overlayStateToggle();
  }
}
