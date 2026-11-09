import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './thanks.html'
})
export class ThanksComponent {}