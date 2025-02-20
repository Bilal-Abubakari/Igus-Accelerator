import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StageComponent } from './stage.component';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and description', () => {
    const titleElement = fixture.debugElement.query(By.css('.stage-title'));
    const descriptionElement = fixture.debugElement.query(By.css('.stage-description'));

    expect(titleElement.nativeElement.textContent).toBe(component.title);
    expect(descriptionElement.nativeElement.textContent).toBe(component.description);
  });

  it('should render image with default attributes', () => {
    const imageElement = fixture.debugElement.query(By.css('.stage-image'));

    expect(imageElement.nativeElement.src).toContain('/imd-stage.png');
    expect(imageElement.nativeElement.alt).toBe('Injection molding mechanical part');
  });

  it('should have correct structure', () => {
    const containerElement = fixture.debugElement.query(By.css('.stage-container'));
    const contentElement = fixture.debugElement.query(By.css('.stage-content'));

    expect(containerElement).toBeTruthy();
    expect(contentElement).toBeTruthy();

    const textContainer = fixture.debugElement.query(By.css('.text-container'));
    const imageContainer = fixture.debugElement.query(By.css('.image-container'));

    expect(textContainer).toBeTruthy();
    expect(imageContainer).toBeTruthy();
  });



});
