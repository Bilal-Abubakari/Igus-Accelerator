import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObjectUtils } from './object-utils';

@Component({
  selector: 'app-model-viewer',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewerComponent implements AfterViewInit, OnDestroy {
  @Input() modelUrl = '';
  @ViewChild('viewer') viewerRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private meshes: THREE.Mesh[] = [];
  private controls!: OrbitControls;
  private snackBar = inject(MatSnackBar);
  private isRendering = false;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.initThreeJS();
    if (this.modelUrl) {
      this.loadModel(this.modelUrl);
    }
  }

  ngOnDestroy(): void {
    this.disposeRenderer();
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);

    this.initRenderer();
    this.initLights();
    this.initCamera();
    this.initControls();

    this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
    this.resizeObserver.observe(this.viewerRef.nativeElement);

    this.startRendering();
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const container = this.viewerRef.nativeElement;
    this.renderer.setSize(
      container.clientWidth || 500,
      container.clientHeight || 500,
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
  }

  private initLights(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const lights = [
      { color: 0xffffff, intensity: 0.7, position: [1, 2, 3] },
      { color: 0xffffff, intensity: 0.3, position: [-1, 0.5, -1] },
      { color: 0xffffff, intensity: 0.2, position: [0, -1, -2] },
    ];

    lights.forEach(({ color, intensity, position }) => {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...(position as [number, number, number]));
      this.scene.add(light);
    });
  }

  private initCamera(): void {
    const container = this.viewerRef.nativeElement;
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);
  }

  private initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    ObjectUtils.merge(this.controls, {
      enableDamping: true,
      dampingFactor: 0.05,
      rotateSpeed: 0.7,
      enableZoom: true,
      enablePan: true,
      autoRotate: true,
      autoRotateSpeed: 1.0,
    });
  }
  private startRendering(): void {
    this.isRendering = true;
    const renderLoop = () => {
      if (!this.isRendering) return;
      requestAnimationFrame(renderLoop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    renderLoop();
  }

  private stopRendering(): void {
    this.isRendering = false;
  }

  private onWindowResize(): void {
    const container = this.viewerRef.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  private loadModel(url: string): void {
    this.clearScene();
    if (!this.scene || !this.renderer) return;

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        const mesh = new THREE.Mesh(geometry, this.createMaterial());
        this.processModel(mesh, geometry);
        this.scene.add(mesh);
        this.meshes.push(mesh);
        this.positionCameraForModel();
      },
      undefined,
      () =>
        this.snackBar.open('Failed to load model.', 'Close', {
          duration: 3000,
        }),
    );
  }

  private createMaterial(): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: 0xd4cfa3,
      metalness: 0.1,
      roughness: 0.7,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
      reflectivity: 0.5,
      envMapIntensity: 0.5,
    });
  }

  private processModel(mesh: THREE.Mesh, geometry: THREE.BufferGeometry): void {
    geometry.computeBoundingBox();
    if (!geometry.boundingBox) return;

    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    const size = new THREE.Vector3();
    geometry.boundingBox.getSize(size);
    const scale = 10.0 / Math.max(size.x, size.y, size.z);
    mesh.scale.set(scale, scale, scale);
  }

  private positionCameraForModel(): void {
    const boundingBox = new THREE.Box3();
    this.meshes.forEach((mesh) => boundingBox.expandByObject(mesh));

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const fitDistance = maxDim * 1;
    this.camera.position.set(
      center.x + fitDistance,
      center.y + fitDistance,
      center.z + fitDistance,
    );
    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
  }

  private clearScene(): void {
    this.meshes.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(
        (m) => m.dispose(),
      );
    });
    this.meshes = [];
  }

  private disposeRenderer(): void {
    this.stopRendering();
    this.renderer.dispose();
    this.resizeObserver.disconnect();
  }
}
