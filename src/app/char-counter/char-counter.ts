import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-char-counter',
  standalone: true,
  templateUrl: './char-counter.html'
})
export class CharCounterComponent {
  @Input() count = 0;
  @Input() min = 0;
  @Input() max = 0;
}