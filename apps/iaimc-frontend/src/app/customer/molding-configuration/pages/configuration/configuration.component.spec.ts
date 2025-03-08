import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationComponent } from './configuration.component';
import { MaterialCardComponent } from '../../../../../../../../libs/ui-components/src/material-view/components/material-card/material-card.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

const mockStore = {
  select: jest.fn().mockReturnValue(of({})),
  selectSignal: jest.fn().mockReturnValue(() => false),
  dispatch: jest.fn(),
};

describe('ConfigurationComponent', () => {
  let component: ConfigurationComponent;
  let fixture: ComponentFixture<ConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationComponent, MaterialCardComponent],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
