import { Component, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CharCounterComponent } from '../char-counter/char-counter';
import { ReviewapiService } from '../services/reviewapi.service';

@Component({
  selector: 'app-addfeedback',
  standalone: true,
  imports: [RouterLink, CharCounterComponent],
  templateUrl: './addfeedback.html',
  styleUrl: './addfeedback.css'
})
export class AddfeedbackComponent {
  moduleId = '';
  errorMsg = signal('');

  constructor (private service: ReviewapiService, private route: ActivatedRoute, private router: Router) {
   this.moduleId = this.route.snapshot.paramMap.get('id') || '';
}

submit(event:Event) {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);

  const review = {
    moduleId: this.moduleId,
    overall: Number(data.get('overall')),
    teaching: Number(data.get('teaching')),
    content: Number(data.get('content')),
    assessmentFairness: Number(data.get('assessmentFairness')),
    hoursPerWeek: Number(data.get('hoursPerWeek')),
    yearTaken: data.get('yearTaken'),
    recommend: data.get('recommend') === 'yes',
    headline: data.get('headline'),
    body: data.get('body')
  };  
  this.service.submitReview(review).subscribe({
    next: () => this.router.navigate(['/student/thanks']),  
   error: err => this.errorMsg.set(err.error?.error || err.error?.message || 'Could not save your review')
  });
}
}
