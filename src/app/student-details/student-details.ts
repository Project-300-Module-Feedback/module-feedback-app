import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-details',
  standalone: true,
  templateUrl: './student-details.html'
})
export class StudentDetailsComponent {
  private router = inject(Router);

  continue(event: Event) {
    event.preventDefault();
    this.router.navigate(['/student/feedback']);
  }
}