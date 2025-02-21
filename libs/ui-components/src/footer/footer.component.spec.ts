import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the proper structure', () => {
    expect(fixture.debugElement.query(By.css('footer'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.footer-container')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.footer-container__contact-us')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.rating-container')),
    ).toBeTruthy();
  });

  it('should display correct contact information', () => {
    const contactElement = fixture.debugElement.query(By.css('.contact__tel'));
    expect(contactElement.nativeElement.textContent).toContain(
      'accelerator modeling configurator® GmbH',
    );

    const phoneLink = contactElement.query(By.css('a'));
    expect(phoneLink.nativeElement.href).toContain('tel:+4922039649145');
    expect(phoneLink.nativeElement.textContent).toBe('+49 2203 9649 145');
  });

  it('should display correct section headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('h4'));
    expect(headers[0].nativeElement.textContent).toBe('Contact us');
    expect(headers[1].nativeElement.textContent).toBe(
      'Please rate this configurator',
    );
  });

  it('should display the correct copyright text', () => {
    fixture.detectChanges();

    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} accelerator modeling configurator® GmbH`;
    const copyrightElement = fixture.debugElement.query(
      By.css('footer > span'),
    );
    expect(copyrightElement).toBeTruthy();
    expect(copyrightElement.nativeElement.textContent.trim()).toBe(
      expectedText,
    );
  });

  it('should render the rating stars', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(stars.length).toBe(5);
    stars.forEach((star) => {
      expect(star.nativeElement.textContent.trim()).toBe('star');
    });
  });

  it('should handle star hover state', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    const thirdStar = stars[2];
    thirdStar.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    const hoveredStars = fixture.debugElement.queryAll(By.css('.hovered'));
    expect(hoveredStars.length).toBe(3);
  });

  it('should handle star selection', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    const fourthStar = stars[3];

    fourthStar.triggerEventHandler('click', null);
    fixture.detectChanges();

    const filledStars = fixture.debugElement.queryAll(By.css('.filled'));
    expect(filledStars.length).toBe(4);
  });

  it('should set selectedRating on star click', () => {
    component.onClick(3);
    expect(component.selectedRating).toBe(3);
  });

  it('should set hoveredRating on mouse enter', () => {
    component.onMouseEnter(4);
    expect(component.hoveredRating).toBe(4);
  });

  it('should reset hoveredRating on mouse leave', () => {
    component.onMouseLeave();
    expect(component.hoveredRating).toBe(0);
  });

  it('should display the feedback form elements', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea.nativeElement.placeholder).toBe('What can we improve?');

    const submitButton = fixture.debugElement.query(
      By.css('button.custom-button[disabled]'),
    );
    expect(submitButton.nativeElement.textContent.trim()).toBe('Submit rating');
  });

  it('should display the contact button', () => {
    const contactButton = fixture.debugElement.query(
      By.css('.contact button.custom-button'),
    );
    expect(contactButton.nativeElement.textContent.trim()).toBe(
      'Write a message',
    );
  });
});
