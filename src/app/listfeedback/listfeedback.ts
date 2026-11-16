import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedbackapiService } from '../services/feedbackapi.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner';
import { AdminStatsComponent } from '../admin-stats/admin-stats';

@Component({
  selector: 'app-listfeedback',
  standalone: true,
  imports: [DatePipe, LoadingSpinnerComponent, AdminStatsComponent],
  templateUrl: './listfeedback.html'
})
export class ListfeedbackComponent implements OnInit {
  constructor(public service: FeedbackapiService) {}

  ngOnInit() {
    this.service.getItems();
  }
}