import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageOverlayComponent } from '../language-switcher/components/language-overlay/language-overlay.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LanguageOverlayService } from '../language-switcher/services/language-overlay/language-overlay.service';

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
  constructor(private readonly dialog: MatDialog) {}

  protected readonly langOverlayService = inject(LanguageOverlayService);

  protected showLangOverlayToggler = computed(() =>
    this.langOverlayService.isOverlayTogglerVisible(),
  );

  public toggleOverlay() {
    this.langOverlayService.overlayTogglerStateToggle();
  }

  openContactForm() {
    this.dialog.open(ContactFormComponent, {
      panelClass: ['full-screen-dialog', 'no-padding-dialog'],
      position: {
        top: '0',
        left: '0',
      },
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}
