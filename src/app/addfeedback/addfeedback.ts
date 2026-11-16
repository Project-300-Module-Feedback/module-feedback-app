import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CharCounterComponent } from '../char-counter/char-counter';

@Component({
  selector: 'app-addfeedback',
  standalone: true,
 // imports: [RouterLink],
  imports: [CharCounterComponent],
  templateUrl: './addfeedback.html',
  styleUrl: './addfeedback.css'
})
export class AddfeedbackComponent {}