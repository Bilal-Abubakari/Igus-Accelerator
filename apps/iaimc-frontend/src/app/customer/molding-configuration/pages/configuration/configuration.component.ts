import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { 
  ModelConfigurationEntity,
  LocalStorageKeys,
  LocalStorageService,
} from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { MaterialsComponent, ModelViewerService, ModelConfigService } from '@igus-accelerator-injection-molding-configurator/ui-components';
import { Store } from '@ngrx/store';
import { selectMaterial } from 'libs/ui-components/src/materials/store/material.selectors';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';

@Component({
  selector: 'app-configuration',
  imports: [MaterialsComponent, MatIconModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent implements AfterViewInit {
  private readonly modelViewerService = inject(ModelViewerService);
  private readonly modelConfigService = inject(ModelConfigService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cdRef = inject(ChangeDetectorRef);

  public isFullScreen = signal(false);

  @ViewChild('viewer')
  private readonly containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('controls')
  private readonly controlsRef!: ElementRef<HTMLDivElement>;


  ngAfterViewInit(): void {
    this.loadActiveConfiguration();
    this.listenForMaterialChanges();
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

          const container = this.containerRef.nativeElement;
          const canvas = await this.modelViewerService.getCanvasOutput(
            response.file.url,
            false,
            container.clientWidth,
            container.clientHeight,
          );
          this.containerRef.nativeElement.append(canvas);
        },
      });
    }
  }

  public async navigateToLibsPage(): Promise<void> {
    await this.router.navigateByUrl(NAVIGATION_ROUTES.LIBRARY);
  }

  public toggleFullScreen(): void {
    const viewer = this.containerRef.nativeElement;

    if (!this.isFullScreen()) {
      if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
      }
      this.isFullScreen.set(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullScreen.set(false);
    }

    document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
  }

  private handleFullscreenChange(): void {
    const isInFullscreen = Boolean(
      document.fullscreenElement
    );

    this.isFullScreen.set(isInFullscreen);

    if (isInFullscreen) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.modelViewerService.resizeCanvas(width, height);
    } else {
      const activeConfigId = this.localStorageService.getLocalItem<string>(
        LocalStorageKeys.ACTIVE_CONFIG,
      );

      const container = this.containerRef.nativeElement;
      const lastChild = container.lastChild;
      while (lastChild && lastChild !== this.controlsRef.nativeElement) {
        container.removeChild(lastChild);
      }

      if (activeConfigId) {
        this.modelConfigService.getActiveConfig(activeConfigId).subscribe({
          next: async (response: ModelConfigurationEntity) => {
            if (!response) return;

            const canvas = await this.modelViewerService.getCanvasOutput(
              response.file.url,
              false,
              container.clientWidth,
              container.clientHeight,
            ) as HTMLCanvasElement;

            container.appendChild(canvas);
            this.cdRef.markForCheck();
          }
        });
      }
    }
  }

  private listenForMaterialChanges(): void {
    this.store.select(selectMaterial).subscribe((selectedMaterial) => {
      if (selectedMaterial) {
        this.modelViewerService.updateModelColor(selectedMaterial.colorHex);
      }
    });
  }

}
