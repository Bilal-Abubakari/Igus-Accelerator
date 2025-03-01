import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  AVAILABLE_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
} from './constants';
import { LanguageOverlayService } from './services/language-overlay/language-overlay.service';
import { Language, LanguageCode } from './types';

@Component({
  selector: 'app-lang-switcher',
  imports: [MatIconModule, MatMenuModule, TranslocoPipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly translocoService = inject(TranslocoService);
  private readonly langOverlayService = inject(LanguageOverlayService);

  public langOverlayToggleEventEmitter = output<null>();

  protected activeLanguageCode = signal<LanguageCode>('en');
  protected isHoverTarget = signal(false);

  protected activeLanguage = computed<Language>(() => ({
    label: LANGUAGE_LABELS[this.activeLanguageCode()],
    code: this.activeLanguageCode(),
    flag: `/assets/flags/${this.activeLanguageCode()}.svg`,
  }));

  ngOnInit(): void {
    this.detectBrowserLocale();
  }

  private detectBrowserLocale() {
    const lang = (navigator.languages as LanguageCode[]).find((lang) =>
      AVAILABLE_LANGUAGE_CODES.includes(lang),
    );

    this.translocoService.setActiveLang(lang ?? DEFAULT_LANGUAGE);
    this.translocoService.langChanges$.subscribe((lang) => {
      this.activeLanguageCode.set(lang as LanguageCode);
    });
    this.activeLanguageCode.set(lang ?? DEFAULT_LANGUAGE);
  }

  public toggleLanguageOverlay() {
    this.langOverlayService.overlayStateToggle();
    this.langOverlayToggleEventEmitter.emit(null);
  }
}
