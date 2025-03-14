import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopCartInfoComponent } from './shop-cart-info.component';
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';

describe('ShopCartInfoComponent', () => {
  let component: ShopCartInfoComponent;
  let fixture: ComponentFixture<ShopCartInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ShopCartInfoComponent,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopCartInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
