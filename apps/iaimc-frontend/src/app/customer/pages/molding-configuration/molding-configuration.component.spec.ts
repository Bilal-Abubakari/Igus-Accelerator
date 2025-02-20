import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoldingConfigurationComponent } from './molding-configuration.component';

describe('MoldingConfigurationComponent', () => {
  let component: MoldingConfigurationComponent;
  let fixture: ComponentFixture<MoldingConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoldingConfigurationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoldingConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
