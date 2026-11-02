import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-listfeedback',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './listfeedback.html'
})
export class ListfeedbackComponent implements OnInit {
  public service = inject(FeedbackapiService);

  ngOnInit() {
    this.service.getItems();
  }
}