import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelLogoComponent } from './model-logo.component';

describe('ModelLogoComponent', () => {
  let component: ModelLogoComponent;
  let fixture: ComponentFixture<ModelLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
