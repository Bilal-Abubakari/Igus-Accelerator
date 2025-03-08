import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsService } from './materials.service';
import { readFileSync } from 'fs';
import { join } from 'path';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('MaterialsService', () => {
  let service: MaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialsService],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read and parse materials.json correctly', () => {
    const mockData = JSON.stringify([
      { id: '1', name: 'Material A' },
      { id: '2', name: 'Material B' },
    ]);

    (readFileSync as jest.Mock).mockReturnValue(mockData);

    const materials = service.getMaterials();
    expect(materials).toEqual([
      { id: '1', name: 'Material A' },
      { id: '2', name: 'Material B' },
    ]);
    expect(readFileSync).toHaveBeenCalledWith(
      join(__dirname, 'assets', 'data', 'json', 'materials.json'),
      'utf8',
    );
  });
});
