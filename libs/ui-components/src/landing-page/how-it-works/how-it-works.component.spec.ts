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
      ],
      providers: [{ provide: TranslocoPipe, useClass: MockTranslocoPipe }],
    })
      .overrideComponent(HowItWorksComponent, {
        set: {
          imports: [
            CommonModule,
            MatCard,
            MatCardContent,
            MatCardTitle,
            TranslocoPipe,
          ],
          providers: [{ provide: TranslocoPipe, useClass: MockTranslocoPipe }],
        },
      })
      .compileComponents();

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

    expect(component.cardContent[0].titleKey).toBe(
      'how-it-works.TITLE.UPLOAD_MODEL',
    );
    expect(component.cardContent[0].description).toBe(
      'how-it-works.DESCRIPTION.UPLOAD_MODEL',
    );
    expect(component.cardContent[0].image).toBe(
      'assets/images/upload-your-model.svg',
    );
    expect(component.cardContent[0].imageAlt).toBe('upload your model Image');

    expect(component.cardContent[1].titleKey).toBe(
      'how-it-works.TITLE.INSTANT_ANALYSIS',
    );
    expect(component.cardContent[1].description).toBe(
      'how-it-works.DESCRIPTION.INSTANT_ANALYSIS',
    );
    expect(component.cardContent[1].image).toBe(
      'assets/images/instant-analysis.svg',
    );
    expect(component.cardContent[1].imageAlt).toBe('instant analysis Image');

    expect(component.cardContent[2].titleKey).toBe(
      'how-it-works.TITLE.EXPECT_REVIEW',
    );
    expect(component.cardContent[2].description).toBe(
      'how-it-works.DESCRIPTION.EXPECT_REVIEW',
    );
    expect(component.cardContent[2].image).toBe(
      'assets/images/expect-review.svg',
    );
    expect(component.cardContent[2].imageAlt).toBe('expect review Image');
  });

  it('should render the correct number of cards', () => {
    const cardElements = fixture.debugElement.queryAll(By.directive(MatCard));
    expect(cardElements.length).toBe(3);
  });

  it('should render titles and descriptions through the transloco pipe', () => {
    fixture.detectChanges();
    const componentHtml = fixture.nativeElement.textContent;

    expect(componentHtml).toContain('en.how-it-works.MAIN_TITLE');

    expect(componentHtml).toContain('en.how-it-works.TITLE.UPLOAD_MODEL');
    expect(componentHtml).toContain('en.how-it-works.TITLE.INSTANT_ANALYSIS');
    expect(componentHtml).toContain('en.how-it-works.TITLE.EXPECT_REVIEW');

    expect(componentHtml).toContain('en.how-it-works.DESCRIPTION.UPLOAD_MODEL');
    expect(componentHtml).toContain(
      'en.how-it-works.DESCRIPTION.INSTANT_ANALYSIS',
    );
    expect(componentHtml).toContain(
      'en.how-it-works.DESCRIPTION.EXPECT_REVIEW',
    );
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

  it('should use TranslocoPipe for rendering content', () => {
    const mockPipe = new MockTranslocoPipe();
    const componentHtml = fixture.nativeElement.textContent;

    const mainTitle = 'how-it-works.MAIN_TITLE';
    const translatedMainTitle = mockPipe.transform(mainTitle);
    expect(componentHtml).toContain(translatedMainTitle);

    component.cardContent.forEach((card) => {
      const translatedTitle = mockPipe.transform(card.titleKey);
      const translatedDescription = mockPipe.transform(card.description);

      expect(componentHtml).toContain(translatedTitle);
      expect(componentHtml).toContain(translatedDescription);
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
