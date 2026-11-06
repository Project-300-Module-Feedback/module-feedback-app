import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FeedbackapiService } from './services/feedbackapi.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public service: FeedbackapiService) {}
}