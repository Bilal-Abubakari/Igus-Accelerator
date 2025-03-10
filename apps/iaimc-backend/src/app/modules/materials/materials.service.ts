import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class MaterialsService {
  private readonly dataPath = join(
    __dirname,
    'assets',
    'data',
    'json',
    'materials.json',
  );

  public getMaterials(): void {
    const data = readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }
}
