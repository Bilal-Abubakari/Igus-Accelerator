import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StageComponent } from './stage.component';
import {
  translocoConfig,
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;
  let translocoService: TranslocoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              stage: {
                title: 'Stage Title',
                description: 'Stage Description',
              },
            },
            es: {
              stage: {
                title: 'Título del Escenario',
                description: 'Descripción del Escenario',
              },
            },
          },
          translocoConfig: translocoConfig({
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
          }),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title depending on the active language', () => {
    translocoService.setActiveLang('en');
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(
      By.css('.stage-title'),
    ).nativeElement;
    expect(titleElement.textContent).toBe('Stage Title');
  });

  it('should display the description text depending on the active language', () => {
    translocoService.setActiveLang('en');
    fixture.detectChanges();
    const descriptionElement = fixture.debugElement.query(
      By.css('.stage-description'),
    ).nativeElement;
    expect(descriptionElement.textContent).toBe('Stage Description');
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
