import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationComponent } from './configuration.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MaterialsComponent } from '../../../../../../../../libs/ui-components/src/materials/materials.component';

const mockMaterials = [
  {
    id: '1',
    name: 'Material A',
    colorhex: '#FF0000',
    tolerancePercentage: 5,
    shrinkage: 0.02,
  },
  {
    id: '2',
    name: 'Material B',
    colorhex: '#00FF00',
    tolerancePercentage: 10,
    shrinkage: 0.05,
  },
];
const mockStore = {
  select: jest.fn().mockReturnValue(of(mockMaterials)),
  selectSignal: jest.fn().mockReturnValue(() => mockMaterials),
  dispatch: jest.fn(),
};

describe('ConfigurationComponent', () => {
  let component: ConfigurationComponent;
  let fixture: ComponentFixture<ConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationComponent, MaterialsComponent],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
