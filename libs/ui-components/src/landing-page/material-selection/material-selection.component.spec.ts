import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialSelectionComponent } from './material-selection.component';
import {
  translocoConfig,
  TranslocoPipe,
  TranslocoTestingModule,
} from '@jsverse/transloco';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

class MockTranslocoPipe {
  transform(key: string) {
    return `en.${key}`;
  }
}

describe('MaterialSelectionComponent', () => {
  let component: MaterialSelectionComponent;
  let fixture: ComponentFixture<MaterialSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialSelectionComponent,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
      ],
      providers: [{ provide: TranslocoPipe, useClass: MockTranslocoPipe }],
    })
      .overrideComponent(MaterialSelectionComponent, {
        set: {
          imports: [
            CommonModule,
            MatCard,
            MatCardContent,
            MatIcon,
            MatCardTitle,
            TranslocoPipe,
          ],
          providers: [{ provide: TranslocoPipe, useClass: MockTranslocoPipe }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MaterialSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize materials array with correct structure', () => {
    expect(component.materials).toBeDefined();
    expect(component.materials.length).toBe(3);

    // Test first material
    expect(component.materials[0].titleKey).toBe('material.ABS.TITLE');
    expect(component.materials[0].features.length).toBe(3);
    expect(component.materials[0].features).toContain(
      'material.ABS.FEATURES.IMPACT',
    );
    expect(component.materials[0].features).toContain(
      'material.ABS.FEATURES.HEAT',
    );
    expect(component.materials[0].features).toContain(
      'material.ABS.FEATURES.FINISH',
    );

    // Test second material
    expect(component.materials[1].titleKey).toBe(
      'material.POLYPROPYLENE.TITLE',
    );
    expect(component.materials[1].features.length).toBe(3);
    expect(component.materials[1].features).toContain(
      'material.POLYPROPYLENE.FEATURES.CHEMICAL',
    );
    expect(component.materials[1].features).toContain(
      'material.POLYPROPYLENE.FEATURES.FLEXIBLE',
    );
    expect(component.materials[1].features).toContain(
      'material.POLYPROPYLENE.FEATURES.DENSITY',
    );

    // Test third material
    expect(component.materials[2].titleKey).toBe('material.CUSTOM.TITLE');
    expect(component.materials[2].features.length).toBe(3);
    expect(component.materials[2].features).toContain(
      'material.CUSTOM.FEATURES.SPECIAL',
    );
    expect(component.materials[2].features).toContain(
      'material.CUSTOM.FEATURES.PROPERTIES',
    );
    expect(component.materials[2].features).toContain(
      'material.CUSTOM.FEATURES.CONSULTATION',
    );
  });

  it('should render the correct number of material cards', () => {
    const materialCards = fixture.debugElement.queryAll(By.directive(MatCard));
    expect(materialCards.length).toBe(3);
  });

  it('should render material titles through the transloco pipe', () => {
    fixture.detectChanges();

    const componentHtml = fixture.nativeElement.textContent;

    expect(componentHtml).toContain('en.material.ABS.TITLE');
    expect(componentHtml).toContain('en.material.POLYPROPYLENE.TITLE');
    expect(componentHtml).toContain('en.material.CUSTOM.TITLE');
  });

  it('should render features for each material', () => {
    fixture.detectChanges();

    const componentHtml = fixture.nativeElement.textContent;

    expect(componentHtml).toContain('en.material.ABS.FEATURES.IMPACT');
    expect(componentHtml).toContain('en.material.ABS.FEATURES.HEAT');
    expect(componentHtml).toContain('en.material.ABS.FEATURES.FINISH');

    expect(componentHtml).toContain(
      'en.material.POLYPROPYLENE.FEATURES.CHEMICAL',
    );
    expect(componentHtml).toContain(
      'en.material.POLYPROPYLENE.FEATURES.FLEXIBLE',
    );
    expect(componentHtml).toContain(
      'en.material.POLYPROPYLENE.FEATURES.DENSITY',
    );

    // Check for Custom features with "en." prefix
    expect(componentHtml).toContain('en.material.CUSTOM.FEATURES.SPECIAL');
    expect(componentHtml).toContain('en.material.CUSTOM.FEATURES.PROPERTIES');
    expect(componentHtml).toContain('en.material.CUSTOM.FEATURES.CONSULTATION');
  });

  it('should use the right Material components in the template', () => {
    const matCardElements = fixture.debugElement.queryAll(
      By.directive(MatCard),
    );
    expect(matCardElements.length).toBe(3);

    const matCardTitleElements = fixture.debugElement.queryAll(
      By.directive(MatCardTitle),
    );
    expect(matCardTitleElements.length).toBe(3);

    const matCardContentElements = fixture.debugElement.queryAll(
      By.directive(MatCardContent),
    );
    expect(matCardContentElements.length).toBe(3);
  });

  it('should use TranslocoPipe for rendering feature texts', () => {
    const componentHtml = fixture.nativeElement.textContent;
    const allFeatures = [
      ...component.materials[0].features,
      ...component.materials[1].features,
      ...component.materials[2].features,
    ];

    const mockPipe = new MockTranslocoPipe();

    allFeatures.forEach((featureKey) => {
      const translatedFeature = mockPipe.transform(featureKey);
      expect(componentHtml).toContain(translatedFeature);
    });
  });
});
