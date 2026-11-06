import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-student-details',
  standalone: true,
  templateUrl: './student-details.html'
})
export class StudentDetailsComponent implements OnInit {
  constructor(private router: Router, public service: FeedbackapiService) {}

  ngOnInit() {
    this.service.getCourses();
  }

  continue(event: Event) {
    event.preventDefault();
    this.router.navigate(['/student/feedback']);
  }
}