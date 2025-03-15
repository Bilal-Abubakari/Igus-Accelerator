import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogService } from './material-dialog.service';
import { MaterialInfoDialogComponent } from '../components/material-info-dialog/material-info-dialog.component';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';

describe('MaterialDialogService', () => {
  let service: MaterialDialogService;
  let dialogMock: jest.Mocked<MatDialog>;

  const createMockMaterial = (
    overrides: Partial<InjectionMoldingMaterial>,
  ): InjectionMoldingMaterial => {
    return {
      id: 'default-id',
      name: 'Default Material',
      ...overrides,
    } as InjectionMoldingMaterial;
  };

  beforeEach(() => {
    const dialogSpy = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        MaterialDialogService,
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    service = TestBed.inject(MaterialDialogService);
    dialogMock = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openMaterialDialog', () => {
    it('should open dialog with correct configuration and data', () => {
      const mockMaterial = createMockMaterial({
        id: 'test-id',
        name: 'Test Material',
      });

      service.openMaterialDialog(mockMaterial);
      expect(dialogMock.open).toHaveBeenCalledWith(
        MaterialInfoDialogComponent,
        {
          panelClass: 'fullscreen-dialog',
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: mockMaterial,
        },
      );
    });

    it('should stop event propagation if event is provided', () => {
      const mockMaterial = createMockMaterial({
        id: 'test-id-2',
        name: 'Another Material',
      });
      const mockEvent = {
        stopPropagation: jest.fn(),
      } as unknown as MouseEvent;

      service.openMaterialDialog(mockMaterial, mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(dialogMock.open).toHaveBeenCalledWith(
        MaterialInfoDialogComponent,
        {
          panelClass: 'fullscreen-dialog',
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: mockMaterial,
        },
      );
    });
  });
});
