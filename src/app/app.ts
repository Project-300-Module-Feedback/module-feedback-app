import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FeedbackapiService } from './services/feedbackapi.service';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public service: FeedbackapiService) {}
}