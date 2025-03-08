import { Controller, Get } from '@nestjs/common';
import { MaterialsService } from './materials.service';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  public getMaterials(): void {
    return this.materialsService.getMaterials();
  }
}
