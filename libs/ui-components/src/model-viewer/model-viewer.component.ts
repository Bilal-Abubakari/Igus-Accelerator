import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-model-viewer',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewerComponent implements AfterViewInit {
  @Input() modelUrl = '';
  @ViewChild('viewer') viewerRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private meshes: THREE.Mesh[] = [];
  private controls!: OrbitControls;
  private snackBar = inject(MatSnackBar);

  ngAfterViewInit() {
    this.initThreeJS();
    if (this.modelUrl.length > 0) {
      this.loadModel(this.modelUrl);
    }
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const container = this.viewerRef.nativeElement;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(1, 2, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-1, 0.5, -1);
    this.scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
    backLight.position.set(0, -1, -2);
    this.scene.add(backLight);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.setupControls();

    window.addEventListener('resize', () => this.onWindowResize());

    this.animate();
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.7;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const container = this.viewerRef.nativeElement;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  private loadModel(url: string): void {
    this.clearScene();
    if (!this.scene || !this.renderer) return;

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xd4cfa3,
          metalness: 0.1,
          roughness: 0.7,
          clearcoat: 0.2,
          clearcoatRoughness: 0.3,
          reflectivity: 0.5,
          envMapIntensity: 0.5,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData['url'] = url;

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        if (boundingBox) {
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          geometry.translate(-center.x, -center.y, -center.z);

          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 10.0 / maxDim;
          mesh.scale.set(scale, scale, scale);
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);
        this.meshes.push(mesh);

        this.positionCameraForModel();
      },
      undefined,
      () => {
        this.snackBar.open(
          'An error happened when loading the model.',
          'Close',
          { duration: 3000 },
        );
      },
    );
  }

  private clearScene(): void {
    this.meshes.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    this.meshes = [];
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

    this.camera.near = fitDistance / 10;
    this.camera.far = fitDistance * 10;
    this.camera.updateProjectionMatrix();

    this.controls.target.copy(center);
    this.controls.update();
  }
}
