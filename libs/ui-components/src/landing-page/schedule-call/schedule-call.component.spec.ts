import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleCallComponent } from './schedule-call.component';
import { By } from '@angular/platform-browser';
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScheduleCallComponent', () => {
  let component: ScheduleCallComponent;
  let fixture: ComponentFixture<ScheduleCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ScheduleCallComponent,
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

  it('should render correct button text', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.action-button'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe(
      'en.cta.SCHEDULE.BUTTON',
    );
    expect(buttons[1].nativeElement.textContent.trim()).toContain(
      'arrow_forwarden.cta.TRY_IT.BUTTON',
    );
  });

  it('should have arrow icon in upload button', () => {
    const arrowIcon = fixture.debugElement.query(By.css('.arrow-icon'));
    expect(arrowIcon).toBeTruthy();
    expect(arrowIcon.nativeElement.textContent.trim()).toBe('arrow_forward');
  });
});
