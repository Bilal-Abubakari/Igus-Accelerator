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
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() flat = false;
  @Input() isIconButton = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();
}
