import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReusableButtonComponent } from './reusable-button.component';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ReusableButtonComponent],
  template: `
    <app-reusable-button
      [className]="className"
      [type]="type"
      [disabled]="disabled"
      [flat]="flat"
      [isIconButton]="isIconButton"
      (buttonClick)="handleClick($event)"
    >
      Button Text
    </app-reusable-button>
  `,
})
class TestHostComponent {
  className = 'test-class';
  type: 'button' | 'submit' | 'reset' = 'button';
  disabled = false;
  flat = false;
  isIconButton = false;
  clickEvent: MouseEvent | null = null;

  handleClick(event: MouseEvent): void {
    this.clickEvent = event;
  }
}

describe('ReusableButtonComponent', () => {
  describe('Standalone tests', () => {
    let component: ReusableButtonComponent;
    let fixture: ComponentFixture<ReusableButtonComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReusableButtonComponent, MatButtonModule],
      }).compileComponents();

      fixture = TestBed.createComponent(ReusableButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.className).toBe('');
      expect(component.type).toBe('button');
      expect(component.disabled).toBe(false);
      expect(component.flat).toBe(false);
      expect(component.isIconButton).toBe(false);
    });

    it('should emit buttonClick event when clicked', () => {
      const emitSpy = jest.spyOn(component.buttonClick, 'emit');
      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', new MouseEvent('click'));
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should render default mat-button when flat and isIconButton are false', () => {
      component.flat = false;
      component.isIconButton = false;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('mat-mdc-button');
    });

    it('should render flat button with correct MDC class', () => {
      component.flat = true;
      component.isIconButton = false;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain(
        'mat-mdc-unelevated-button',
      );
    });

    it('should render icon button when isIconButton is true', () => {
      component.isIconButton = true;
      component.flat = true;
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('mat-mdc-icon-button');
    });
  });

  describe('Integration tests with host component', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MatButtonModule, TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should apply custom class name', () => {
      hostComponent.className = 'custom-class';
      hostFixture.detectChanges();

      const button = hostFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('custom-class');
    });

    it('should set button type correctly', () => {
      hostComponent.type = 'submit';
      hostFixture.detectChanges();

      const button = hostFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.type).toBe('submit');
    });

    it('should disable button when disabled is true', () => {
      hostComponent.disabled = true;
      hostFixture.detectChanges();

      const button = hostFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should emit click events properly', () => {
      const spy = jest.spyOn(hostComponent, 'handleClick');
      const button = hostFixture.debugElement.query(By.css('button'));
      const mockEvent = new MouseEvent('click');

      button.nativeElement.dispatchEvent(mockEvent);
      expect(spy).toHaveBeenCalledWith(mockEvent);
    });

    it('should render projected content', () => {
      const button = hostFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.textContent.trim()).toBe('Button Text');
    });

    it('should handle flat button style', () => {
      hostComponent.flat = true;
      hostFixture.detectChanges();

      const button = hostFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain(
        'mat-mdc-unelevated-button',
      );
    });

    it('should handle icon button style', () => {
      hostComponent.isIconButton = true;
      hostFixture.detectChanges();

      const button = hostFixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList).toContain('mat-mdc-icon-button');
    });
  });
});
