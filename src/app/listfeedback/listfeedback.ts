import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedbackapiService } from '../services/feedbackapi.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'app-listfeedback',
  standalone: true,
  imports: [DatePipe, LoadingSpinnerComponent],
  templateUrl: './listfeedback.html'
})
export class ListfeedbackComponent implements OnInit {
  constructor(public service: FeedbackapiService) {}

  ngOnInit() {
    this.service.getItems();
  }
}