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

// Create a mock TranslocoPipe to simulate translations
class MockTranslocoPipe {
  transform(key: string) {
    return `en.${key}`;
  }
}
describe('HowItWorksComponent', () => {
  let component: HowItWorksComponent;
  let fixture: ComponentFixture<HowItWorksComponent>;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cardContent correctly', () => {
    expect(component.cardContent).toBeDefined();
    expect(component.cardContent.length).toBe(3);

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

    component.cardContent.forEach((card, index) => {
      expect(card.titleKey).toBe(expectedContent[index].titleKey);
      expect(card.description).toBe(expectedContent[index].description);
      expect(card.image).toBe(expectedContent[index].image);
      expect(card.imageAlt).toBe(expectedContent[index].imageAlt);
    });
  });

  it('should render the correct number of cards', () => {
    const cardElements = fixture.debugElement.queryAll(By.directive(MatCard));
    expect(cardElements.length).toBe(3);
  });

  it('should render titles and descriptions through the transloco pipe', () => {
    fixture.detectChanges();
    const componentHtml = fixture.nativeElement.textContent;

    // Check for main title
    expect(componentHtml).toContain('en.how-it-works.MAIN_TITLE');

    // Check for card titles and descriptions
    component.cardContent.forEach((card) => {
      const translatedTitle = new MockTranslocoPipe().transform(card.titleKey);
      const translatedDescription = new MockTranslocoPipe().transform(
        card.description,
      );

      expect(componentHtml).toContain(translatedTitle);
      expect(componentHtml).toContain(translatedDescription);
    });
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

  it('should have the correct number of images and alt texts', () => {
    const imageElements = fixture.debugElement.queryAll(By.css('img'));
    expect(imageElements.length).toBe(3);

    imageElements.forEach((imgEl, index) => {
      expect(imgEl.attributes['src']).toBe(component.cardContent[index].image);
      expect(imgEl.attributes['alt']).toBe(
        component.cardContent[index].imageAlt,
      );
    });
  });

  it('should check the structure of each card content', () => {
    const cards = fixture.debugElement.queryAll(By.directive(MatCard));

    cards.forEach((card, index) => {
      const img = card.query(By.css('img'));
      expect(img).toBeTruthy();
      expect(img.attributes['src']).toBe(component.cardContent[index].image);
      expect(img.attributes['alt']).toBe(component.cardContent[index].imageAlt);

      const content = card.query(By.directive(MatCardContent));
      expect(content).toBeTruthy();

      const title = content.query(By.directive(MatCardTitle));
      expect(title).toBeTruthy();

      const description = content.query(By.css('p'));
      expect(description).toBeTruthy();
    });
  });

  it('should render the entire component structure', () => {
    const section = fixture.debugElement.query(
      By.css('.how-it-works__section'),
    );
    expect(section).toBeTruthy();

    const title = section.query(By.css('.how-it-works__title'));
    expect(title).toBeTruthy();

    const grid = section.query(By.css('.how-it-works__grid'));
    expect(grid).toBeTruthy();

    const cards = grid.queryAll(By.css('.material-card'));
    expect(cards.length).toBe(3);
  });
});
