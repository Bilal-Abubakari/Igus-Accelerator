import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-model-viewer',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelViewerComponent implements AfterViewInit, OnChanges {
  @Input() modelUrls: string[] = [];
  @ViewChild('viewer') viewerRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private meshes: THREE.Mesh[] = [];
  private controls!: OrbitControls;

  ngAfterViewInit() {
    this.initThreeJS();
    if (this.modelUrls.length > 0) {
      this.modelUrls.forEach((url) => this.loadModel(url));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modelUrls'] && this.modelUrls.length > 0) {
      this.meshes.forEach((mesh) => this.scene.remove(mesh));
      this.meshes = [];
      this.modelUrls.forEach((url) => this.loadModel(url));
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

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        if (boundingBox) {
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          geometry.translate(-center.x, -center.y, -center.z);

          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;
          mesh.scale.set(scale, scale, scale);
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);
        this.meshes.push(mesh);

        this.positionCameraForModel(boundingBox);
      },
      undefined,
      (error) => {
        console.error('An error happened when loading the model:', error);
      },
    );
  }

  private positionCameraForModel(boundingBox: THREE.Box3 | null): void {
    if (!boundingBox) return;

    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    this.camera.position.set(maxDim * 2, maxDim * 1.5, maxDim * 2);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }
}
