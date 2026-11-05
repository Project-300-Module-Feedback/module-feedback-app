import { Component } from '@angular/core';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-addfeedback',
  standalone: true,
  templateUrl: './addfeedback.html'
})
export class AddfeedbackComponent {
  constructor(private service: FeedbackapiService) {}

  submitForm(comment: string) {
    this.service.addItem(comment);
  }
}