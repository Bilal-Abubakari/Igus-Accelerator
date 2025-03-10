import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';
import { StageComponent } from './stage.component';
import { Location } from '@angular/common';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
        RouterTestingModule.withRoutes([
          { path: 'library', component: StageComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the start project and learn more buttons', () => {
    const startProjectBtn = fixture.debugElement.query(
      By.css('.stage-buttons__primary__btn'),
    ).parent?.nativeElement;
    const learnMore = fixture.debugElement.query(
      By.css('.stage-buttons__secondary__btn'),
    ).parent?.nativeElement;

    expect(startProjectBtn).toBeTruthy();
    expect(learnMore).toBeTruthy();
  });

  it('should have the proper structure', () => {
    expect(fixture.debugElement.query(By.css('.stage-container'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.stage-content'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.text-container'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.stage-buttons'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.stage-buttons__primary__btn')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.stage-buttons__secondary__btn')),
    ).toBeTruthy();
  });

  it('should navigate to /library when start project button is clicked', async () => {
    const startProjectBtn = fixture.debugElement.query(
      By.css('.stage-buttons__primary__btn'),
    ).nativeElement;

    startProjectBtn.click();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(location.path()).toBe('/library');
  });
});
