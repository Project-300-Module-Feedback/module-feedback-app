import { Component, inject } from '@angular/core';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-addfeedback',
  standalone: true,
  templateUrl: './addfeedback.html'
})
export class AddfeedbackComponent {
  private service = inject(FeedbackapiService);

  submitForm(comment: string) {
    this.service.addItem(comment);
  }
}