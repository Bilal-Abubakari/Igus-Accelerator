import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../store/material.model';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly http = inject(HttpClient);
  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}

  public getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/materials`);
  }
}
