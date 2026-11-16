import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.html'
})
export class LoadingSpinnerComponent {
  @Input() text = 'Loading...';
}