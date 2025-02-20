import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducibilityComponent } from './producibility.component';

describe('ProducibilityComponent', () => {
  let component: ProducibilityComponent;
  let fixture: ComponentFixture<ProducibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducibilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProducibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
