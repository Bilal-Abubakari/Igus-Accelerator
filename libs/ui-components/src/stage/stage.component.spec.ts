import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';
import { StageComponent } from './stage.component';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an image with correct attributes', () => {
    const imageElement = fixture.debugElement.query(By.css('.stage-image'));
    expect(imageElement).toBeTruthy();
    expect(imageElement.attributes['src']).toBe('/imd-stage.png');
    expect(imageElement.attributes['alt']).toBe(
      'Injection molding mechanical part',
    );
  });

  it('should have the proper structure', () => {
    expect(fixture.debugElement.query(By.css('.stage-container'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.stage-content'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.text-container'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.image-container'))).toBeTruthy();
  });
});
