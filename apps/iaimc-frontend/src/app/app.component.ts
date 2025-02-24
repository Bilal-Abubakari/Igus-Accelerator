import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'invalidSelector',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnChanges {
  title = 'Welcome iaimc-frontend';

  @Input('renamedInput') someValue!: string;
  @Output() clickEvent = new EventEmitter<void>();

  ngOnInit() {}
  ngOnChanges() {}

  onClick() {
    console.log('Button clicked');
  }
}
