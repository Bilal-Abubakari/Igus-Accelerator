import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { selectAllModels } from '@apps/iaimc-frontend/src/app/customer/store/model-upload/model-upload.selectors';
import { Model } from '@apps/iaimc-frontend/src/app/customer/store/model-upload/model-upload.state';

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelListComponent implements AfterViewInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly cdRef = inject(ChangeDetectorRef);
  protected models = this.store.selectSignal(selectAllModels);
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  private renderers: Map<string, THREE.WebGLRenderer> = new Map();
  private scenes: Map<string, THREE.Scene> = new Map();
  private cameras: Map<string, THREE.PerspectiveCamera> = new Map();
  private controls: Map<string, OrbitControls> = new Map();

  ngAfterViewInit(): void {
    // Load existing models on view init
    this.models().forEach((model) => this.createViewer(model));
  }

  ngOnDestroy(): void {
    // Dispose of all renderers when component is destroyed
    this.renderers.forEach((renderer) => renderer.dispose());
  }

  private createViewer(model: Model): void {
    if (!model.previewUrl) return;

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Light gray background

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Create a WebGL renderer and attach it to a new div inside the card
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(200, 200);
    const container = document.createElement('div');
    container.className = 'model-viewer';
    container.appendChild(renderer.domElement);
    this.canvasContainer.nativeElement.appendChild(container);

    // Store references
    this.scenes.set(model.id, scene);
    this.cameras.set(model.id, camera);
    this.renderers.set(model.id, renderer);

    // Add lights for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Brighter light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Stronger directional light
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a grid for reference
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add AxesHelper for debugging
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Load STL model
    const loader = new STLLoader();
    loader.load(
      model.previewUrl,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        const mesh = new THREE.Mesh(geometry, material);

        // Compute bounding box to center the model
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          const center = new THREE.Vector3();
          geometry.boundingBox.getCenter(center);
          mesh.position.sub(center);

          // Adjust camera based on model size
          const size = new THREE.Vector3();
          geometry.boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(0, 0, maxDim * 3); // Adjust Z distance
        }

        scene.add(mesh);
      },
      undefined,
      (error) => console.error('Error loading STL:', error),
    );

    // Add OrbitControls for rotation/zoom/pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    this.controls.set(model.id, controls);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
}
