import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StageComponent } from './stage.component';
import { ChangeDetectionStrategy } from '@angular/core';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageComponent],
    })
      .overrideComponent(StageComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and description', () => {
    const titleElement = fixture.debugElement.query(By.css('.stage-title'));
    const descriptionElement = fixture.debugElement.query(
      By.css('.stage-description'),
    );

    expect(titleElement.nativeElement.textContent).toBe(component.title);
    expect(descriptionElement.nativeElement.textContent).toBe(
      component.description,
    );
  });

  it('should render image with default attributes', () => {
    const imageElement = fixture.debugElement.query(By.css('.stage-image'));

    expect(imageElement.nativeElement.src).toContain(component.imageUrl);
    expect(imageElement.nativeElement.alt).toBe(component.imageAlt);
  });

  it('should have correct structure', () => {
    const containerElement = fixture.debugElement.query(
      By.css('.stage-container'),
    );
    const contentElement = fixture.debugElement.query(By.css('.stage-content'));

    expect(containerElement).toBeTruthy();
    expect(contentElement).toBeTruthy();

    const textContainer = fixture.debugElement.query(By.css('.text-container'));
    const imageContainer = fixture.debugElement.query(
      By.css('.image-container'),
    );

    expect(textContainer).toBeTruthy();
    expect(imageContainer).toBeTruthy();
  });

  it('should update content when inputs change', () => {
    component.title = 'Custom Title';
    component.description = 'Custom description text';
    component.imageUrl = '/custom-image.png';
    component.imageAlt = 'Custom alt text';

    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.stage-title'));
    const descriptionElement = fixture.debugElement.query(
      By.css('.stage-description'),
    );
    const imageElement = fixture.debugElement.query(By.css('.stage-image'));

    expect(titleElement.nativeElement.textContent).toBe('Custom Title');
    expect(descriptionElement.nativeElement.textContent).toBe(
      'Custom description text',
    );
    expect(imageElement.nativeElement.src).toContain('/custom-image.png');
    expect(imageElement.nativeElement.alt).toBe('Custom alt text');
  });

  it('should handle empty inputs gracefully', () => {
    component.title = '';
    component.description = '';
    component.imageUrl = '';
    component.imageAlt = '';

    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.stage-title'));
    const descriptionElement = fixture.debugElement.query(
      By.css('.stage-description'),
    );
    const imageElement = fixture.debugElement.query(By.css('.stage-image'));

    expect(titleElement.nativeElement.textContent).toBe('');
    expect(descriptionElement.nativeElement.textContent).toBe('');
    expect(imageElement.nativeElement.src).not.toContain('/imd-stage.png');
    expect(imageElement.nativeElement.alt).toBe('');
  });
});
