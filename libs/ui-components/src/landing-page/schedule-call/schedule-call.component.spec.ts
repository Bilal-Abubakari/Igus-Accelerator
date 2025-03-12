import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleCallComponent } from './schedule-call.component';
import { By } from '@angular/platform-browser';
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';

// Mock ReusableButtonComponent as standalone
@Component({
  selector: 'app-reusable-button',
  template:
    '<button [class]="className" (click)="handleClick()">{{buttonText}}<ng-content></ng-content></button>',
  standalone: true,
})
class MockReusableButtonComponent {
  @Input() className = '';
  @Input() color = '';
  @Input() isInFooter = false;
  @Input() styles: Record<string, string> = {};
  @Input() routerLink: never[] = [];
  @Output() buttonClick = new EventEmitter<void>();

  buttonText = '';

  handleClick(): void {
    this.buttonClick.emit();
  }
}

describe('ScheduleCallComponent', () => {
  let component: ScheduleCallComponent;
  let fixture: ComponentFixture<ScheduleCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ScheduleCallComponent, // Import as standalone component
        MockReusableButtonComponent, // Import mock as standalone
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title correctly', () => {
    const titleElement = fixture.debugElement.query(By.css('.title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('en.cta.TITLE');
  });

  it('should display two option cards', () => {
    const optionCards = fixture.debugElement.queryAll(By.css('.option-card'));
    expect(optionCards.length).toBe(2);
  });

  it('should render correct descriptions for each option', () => {
    const descriptions = fixture.debugElement.queryAll(
      By.css('.option-description'),
    );

    expect(descriptions[0].nativeElement.textContent.trim()).toBe(
      'en.cta.SCHEDULE.DESCRIPTION',
    );
    expect(descriptions[1].nativeElement.textContent.trim()).toBe(
      'en.cta.TRY_IT.DESCRIPTION',
    );
  });

  it('should render reusable buttons with correct content', () => {
    const buttons = fixture.debugElement.queryAll(
      By.css('app-reusable-button'),
    );
    expect(buttons.length).toBe(2);

    const scheduleButtonContent = buttons[0].nativeElement.textContent.trim();
    expect(scheduleButtonContent).toContain('en.cta.SCHEDULE.BUTTON');

    const tryItButtonContent = buttons[1].nativeElement.textContent.trim();
    expect(tryItButtonContent).toContain('en.cta.TRY_IT.BUTTON');
  });

  it('should have arrow icon in the try it button', () => {
    const tryItButton = fixture.debugElement.queryAll(
      By.css('app-reusable-button'),
    )[1];
    const arrowIcon = tryItButton.query(By.css('.arrow-icon'));

    expect(arrowIcon).toBeTruthy();
    expect(arrowIcon.nativeElement.textContent.trim()).toBe('arrow_forward');
  });

  it('should call openContactForm when schedule button is clicked', () => {
    jest.spyOn(component, 'openContactForm');

    const scheduleButton = fixture.debugElement.queryAll(
      By.css('app-reusable-button'),
    )[0];
    const buttonElement = scheduleButton.query(By.css('button'));
    buttonElement.nativeElement.click();

    expect(component.openContactForm).toHaveBeenCalled();
  });
});
