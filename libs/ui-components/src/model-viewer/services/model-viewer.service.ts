import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ObjectUtils } from '../../utilities/object-utils';

@Injectable({ providedIn: 'root' })
export class ModelViewerService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private modelMesh!: THREE.Mesh;
  private readonly loader = new STLLoader();
  private controls!: OrbitControls;
  private isRendering = false;

  public initializeViewer(
    canvas: HTMLCanvasElement,
    width = 250,
    height = 220,
  ) {
    const canvasBackground = 0xe5e7eb;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(canvasBackground, 1);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    this.addLights();
    this.initControls();
    this.updateRendering();
  }

  private onWindowResize(canvas: HTMLCanvasElement): void {
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  public loadModel(modelUrl: string, onLoadCallback?: () => void) {
    this.loader.load(modelUrl, (geometry) => {
      if (this.modelMesh) this.scene.remove(this.modelMesh);
      this.modelMesh = new THREE.Mesh(geometry, this.createMaterial());
      this.processModel(this.modelMesh, geometry);
      this.scene.add(this.modelMesh);
      this.positionCameraForModel(this.modelMesh);
      this.renderScene();
      if (onLoadCallback) onLoadCallback();
    });
  }

  public addLights() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const lights = [
      { color: 0xffffff, intensity: 0.7, position: [1, 2, 3] },
      { color: 0xffffff, intensity: 0.4, position: [-1, 0.5, -1] },
      { color: 0xffffff, intensity: 0.3, position: [0, -1, -2] },
    ];

    lights.forEach(({ color, intensity, position }) => {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...(position as [number, number, number]));
      this.scene.add(light);
    });
  }

  public createMaterial(colorHex?: string): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: colorHex ?? 0xd4cfa3,
      metalness: 0.0,
      roughness: 0.7,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
      reflectivity: 0.5,
      envMapIntensity: 0.5,
      flatShading: false,
    });
  }

  public positionCameraForModel(mesh: THREE.Mesh) {
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fitDistance = maxDim * 2;
    this.camera.position.set(
      center.x + fitDistance,
      center.y + fitDistance,
      center.z + fitDistance,
    );
    this.camera.lookAt(center);
  }

  private processModel(mesh: THREE.Mesh, geometry: THREE.BufferGeometry) {
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

  private initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    ObjectUtils.merge(this.controls, {
      enableDamping: true,
      dampingFactor: 0.05,
      rotateSpeed: 0.7,
      enableZoom: true,
      enablePan: true,
      autoRotate: true,
      autoRotateSpeed: 0.1,
    });
  }

  public renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  private updateRendering(): void {
    this.isRendering = true;
    const renderLoop = () => {
      if (!this.isRendering) return;
      requestAnimationFrame(renderLoop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    renderLoop();
  }

  public resizeCanvas(width: number, height: number): void {
    if (!this.renderer || !this.camera) return;

    if (width <= 0 || height <= 0) {
      return;
    }

    try {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height, true);

      if (this.controls) {
        this.controls.update();
      }

      this.renderScene();
    } catch {
      console.error()
    }
  }

  public updateModelColor(colorHex: string): boolean {
    if (!this.modelMesh) {
      return false;
    }

    try {
      // Check if the material is a MeshPhysicalMaterial or an array of materials
      if (this.modelMesh.material instanceof THREE.MeshPhysicalMaterial) {
        this.modelMesh.material.color.set(colorHex);
        this.modelMesh.material.needsUpdate = true;
        this.renderScene();
        return true;
      } else if (Array.isArray(this.modelMesh.material)) {
        // If it's an array of materials, update all of them
        this.modelMesh.material.forEach(mat => {
          if (mat instanceof THREE.MeshPhysicalMaterial) {
            mat.color.set(colorHex);
            mat.needsUpdate = true;
          }
        });
        this.renderScene();
        return true;
      } else {
        // If it's another type of material, create a new one and replace it
        const newMaterial = this.createMaterial(colorHex);
        this.modelMesh.material = newMaterial;
        this.renderScene();
        return true;
      }
    } catch {
      return false;
    }
  }


  public getCanvasOutput(
    modelUrl: string,
    asDataUrl: boolean,
    canvasWidth?: number,
    canvasHeight?: number,
    cameraDistance?: number,
  ): Promise<string | HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    this.initializeViewer(canvas, canvasWidth, canvasHeight);

    return new Promise((resolve) => {
      this.loader.load(modelUrl, (geometry) => {
        if (this.modelMesh) this.scene.remove(this.modelMesh);

        this.modelMesh = new THREE.Mesh(geometry, this.createMaterial());
        this.processModel(this.modelMesh, geometry);
        this.scene.add(this.modelMesh);

        // Use custom camera positioning for snapshots
        const boundingBox = new THREE.Box3().setFromObject(this.modelMesh);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        const fitDistance = maxDim * (cameraDistance ?? 1.6);

        this.camera.position.set(
          center.x + fitDistance,
          center.y + fitDistance,
          center.z + fitDistance
        );
        this.camera.lookAt(center);

        this.renderScene();
        resolve(
          asDataUrl
            ? this.renderer.domElement.toDataURL()
            : this.renderer.domElement
        );
      });
    });

    // const canvas = document.createElement('canvas');
    // this.initializeViewer(canvas, canvasWidth, canvasHeight);

    // return new Promise((resolve) => {
    //   this.loadModel(modelUrl, () => {
    //     this.renderScene();
    //     resolve(
    //       asDataUrl
    //         ? this.renderer.domElement.toDataURL()
    //         : this.renderer.domElement,
    //     );
    //   });
    // });
  }
}
