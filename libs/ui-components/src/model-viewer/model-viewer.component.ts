import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  viewChild,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  templateUrl: './model-viewer.component.html',
  styleUrl: './model-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewerComponent implements AfterViewInit {
  private modelViewerRef = viewChild<ElementRef>('`modelViewer');
  @Input() modelUrl!: string;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  ngAfterViewInit(): void {
    if (!this.modelUrl) {
      console.error('Model URL not provided');
      return;
    }
    this.initThree();
    this.loadModel(this.modelUrl);
  }

  private initThree(): void {
    const container = this.modelViewerRef()?.nativeElement;
    if (!container) {
      console.error('Model Viewer container not found');
      return;
    }

    // Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private loadModel(url: string): void {
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({
          color: 0x0077ff,
          metalness: 0.5,
          roughness: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
      },
      undefined,
      (error) => console.error('Error loading model:', error),
    );
  }
}
