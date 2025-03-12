import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  translocoConfig,
  TranslocoPipe,
  TranslocoTestingModule,
} from '@jsverse/transloco';
import { HowItWorksComponent } from './how-it-works.component';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';

class MockTranslocoPipe {
  transform(key: string) {
    return `en.${key}`;
  }
}

describe('HowItWorksComponent', () => {
  let component: HowItWorksComponent;
  let fixture: ComponentFixture<HowItWorksComponent>;

  const expectedContent = [
    {
      titleKey: 'how-it-works.TITLE.UPLOAD_MODEL',
      description: 'how-it-works.DESCRIPTION.UPLOAD_MODEL',
      image: 'assets/images/upload-your-model.svg',
      imageAlt: 'upload your model Image',
    },
    {
      titleKey: 'how-it-works.TITLE.INSTANT_ANALYSIS',
      description: 'how-it-works.DESCRIPTION.INSTANT_ANALYSIS',
      image: 'assets/images/instant-analysis.svg',
      imageAlt: 'instant analysis Image',
    },
    {
      titleKey: 'how-it-works.TITLE.EXPECT_REVIEW',
      description: 'how-it-works.DESCRIPTION.EXPECT_REVIEW',
      image: 'assets/images/expect-review.svg',
      imageAlt: 'expect review Image',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HowItWorksComponent,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
        CommonModule,
        MatCard,
        MatCardContent,
        MatCardTitle,
      ],
      providers: [{ provide: TranslocoPipe, useClass: MockTranslocoPipe }],
    }).compileComponents();
    fixture = TestBed.createComponent(HowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function verifyCardContent() {
    component.cardContent.forEach((card, index) => {
      expect(card.titleKey).toBe(expectedContent[index].titleKey);
      expect(card.description).toBe(expectedContent[index].description);
      expect(card.image).toBe(expectedContent[index].image);
      expect(card.imageAlt).toBe(expectedContent[index].imageAlt);
    });
  }

  function verifyMaterialComponents() {
    expect(fixture.debugElement.queryAll(By.directive(MatCard)).length).toBe(3);
    expect(
      fixture.debugElement.queryAll(By.directive(MatCardTitle)).length,
    ).toBe(3);
    expect(
      fixture.debugElement.queryAll(By.directive(MatCardContent)).length,
    ).toBe(3);
  }

  function verifyImages() {
    const imageElements = fixture.debugElement.queryAll(By.css('img'));
    expect(imageElements.length).toBe(3);
    imageElements.forEach((imgEl, index) => {
      expect(imgEl.attributes['src']).toBe(component.cardContent[index].image);
      expect(imgEl.attributes['alt']).toBe(
        component.cardContent[index].imageAlt,
      );
    });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cardContent correctly', verifyCardContent);
  it('should render the correct number of cards', verifyMaterialComponents);
  it('should render titles and descriptions through the transloco pipe', () => {
    fixture.detectChanges();
    const componentHtml = fixture.nativeElement.textContent;
    expect(componentHtml).toContain('en.how-it-works.MAIN_TITLE');
    component.cardContent.forEach((card) => {
      expect(componentHtml).toContain(
        new MockTranslocoPipe().transform(card.titleKey),
      );
      expect(componentHtml).toContain(
        new MockTranslocoPipe().transform(card.description),
      );
    });
  });
  it(
    'should use the right Material components in the template',
    verifyMaterialComponents,
  );
  it('should have the correct number of images and alt texts', verifyImages);
  it('should check the structure of each card content', verifyImages);
});
