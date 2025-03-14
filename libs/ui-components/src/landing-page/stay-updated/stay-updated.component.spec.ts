import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StayUpdatedComponent } from './stay-updated.component';
import { getTranslocoModule } from '../../transloco-test-config/transloco-testing.module';

describe('StayUpdatedComponent', () => {
  let component: StayUpdatedComponent;
  let fixture: ComponentFixture<StayUpdatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StayUpdatedComponent, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(StayUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
