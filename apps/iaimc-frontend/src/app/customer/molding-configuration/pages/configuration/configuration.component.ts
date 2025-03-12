import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { ModelViewerService } from '@igus-accelerator-injection-molding-configurator/ui-components';
import {
  LocalStorageKeys,
  LocalStorageService,
} from 'libs/shared/services/local-storage.service';
import { ModelConfigService } from 'libs/ui-components/src/model-viewer/services/model-config.service';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';

@Component({
  selector: 'app-configuration',
  imports: [CommonModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent implements AfterViewInit {
  private readonly modelViewerService = inject(ModelViewerService);
  private readonly modelConfigService = inject(ModelConfigService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  @ViewChild('viewer')
  private readonly container!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.loadActiveConfiguration();
  }

  public async loadActiveConfiguration(): Promise<void> {
    const activeConfigId = this.localStorageService.getLocalItem<string>(
      LocalStorageKeys.ACTIVE_CONFIG,
    );
    if (!activeConfigId) {
      await this.navigateToLibsPage();
    } else {
      this.modelConfigService.getActiveConfig(activeConfigId).subscribe({
        next: async (response: ModelConfigurationEntity) => {
          if (!response) {
            await this.navigateToLibsPage();
            return;
          }

          const container = this.container.nativeElement;
          const canvas = await this.modelViewerService.getCanvasOutput(
            response.file.url,
            false,
            container.clientWidth,
            container.clientHeight,
          );
          this.container.nativeElement.append(canvas);
        },
      });
    }
  }

  public async navigateToLibsPage(): Promise<void> {
    await this.router.navigateByUrl(NAVIGATION_ROUTES.LIBRARY);
  }
}
