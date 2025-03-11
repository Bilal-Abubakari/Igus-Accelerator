import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly http = inject(HttpClient);
  constructor(@Inject('BASE_API_URL') private readonly baseUrl: string) {}

  public getMaterials(): Observable<InjectionMoldingMaterial[]> {
    return this.http.get<InjectionMoldingMaterial[]>(
      `${this.baseUrl}/materials`,
    );
  }
}
