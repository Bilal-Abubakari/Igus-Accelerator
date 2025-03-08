import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../store/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly dataUrl = 'assets/materials.json';

  private readonly http = inject(HttpClient);

  public getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.dataUrl);
  }
}
