import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialInfoDialogComponent } from './material-info-dialog.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createMockMaterial } from '../../store/mocks/mock-material';

describe('MaterialInfoDialogComponent', () => {
  let component: MaterialInfoDialogComponent;
  let fixture: ComponentFixture<MaterialInfoDialogComponent>;
  let mockStore: { select: jest.Mock };
  let mockDialogRef: { close: jest.Mock };
  const mockMaterial = createMockMaterial();

  beforeEach(async () => {
    mockStore = {
      select: jest.fn().mockReturnValue(of(mockMaterial)),
    };

    mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MaterialInfoDialogComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { id: 'default-id' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the material name in the header', () => {
    const headerElement = fixture.nativeElement.querySelector('header');
    expect(headerElement.textContent).toContain(mockMaterial.name);
    expect(headerElement.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('should close the dialog when the close button is clicked', () => {
    const closeButton =
      fixture.nativeElement.querySelector('button[mat-button]');
    closeButton.click();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should return the correct resistance class', () => {
    expect(component.getResistanceClass('o')).toBe('neutral');
    expect(component.getResistanceClass('x')).toBe('bad');
    expect(component.getResistanceClass('+')).toBe('good');
    expect(component.getResistanceClass('unknown')).toBe('unknown');
  });
});
