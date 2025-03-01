import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelLibraryComponent } from './model-library.component';
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';

describe('ModelLibraryComponent', () => {
  let component: ModelLibraryComponent;
  let fixture: ComponentFixture<ModelLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModelLibraryComponent,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
