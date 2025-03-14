import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reusable-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './reusable-button.component.html',
  styleUrl: './reusable-button.component.scss',
})
export class ReusableButtonComponent {
  @Input() className = '';
  @Input() isInFooter = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() flat = false;
  @Input() ariaLabel = '';
  @Input() isIconButton = false;
  @Input() backgroundColor = '';
  @Input() color = 'white';
  @Input() btnWidth = '100%';
  @Input() btnHeight = '51px';
  @Input() borderRadius = '0';
  @Input() enablePadding = false;
  @Input() btnPadding = '0';
  @Input() displayBtnLabels = '';
  @Input() justifyBtnLabels = '';
  @Input() alignBtnLabels = '';
  @Input() styles: { [key: string]: string } = {}; //deprecated (refer to shop-cart-info.component to see new usage)

  @Output() buttonClick = new EventEmitter<MouseEvent>();
}
