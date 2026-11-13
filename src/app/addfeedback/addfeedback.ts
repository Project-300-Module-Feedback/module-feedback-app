import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FeedbackapiService } from '../services/feedbackapi.service';
import { ReviewapiService } from '../services/reviewapi.service';
import { NewReview } from '../models/review';

@Component({
  selector: 'app-addfeedback',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addfeedback.html',
  styleUrl: './addfeedback.css'
})
export class AddfeedbackComponent implements OnInit {
  moduleId = '';
  saving = signal(false);
  errorMsg = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    public feedback: FeedbackapiService,
    private reviews: ReviewapiService
  ) {}

  ngOnInit() {
    // the module comes from the link, e.g. /student/feedback/<moduleId>
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') ?? '';
    if (this.moduleId) {
      this.feedback.getModule(this.moduleId);
    }
  }

  submitReview(event: Event) {
    event.preventDefault();

    // reads every field in the form by its name=""
    const form = new FormData(event.target as HTMLFormElement);
    const review: NewReview = {
      moduleId: this.moduleId,
      overall: Number(form.get('overall')),
      teaching: Number(form.get('teaching')),
      content: Number(form.get('content')),
      assessmentFairness: Number(form.get('assessmentFairness')),
      hoursPerWeek: Number(form.get('hoursPerWeek')),
      yearTaken: String(form.get('yearTaken') ?? ''),
      recommend: form.get('recommend') === 'yes',
      headline: String(form.get('headline') ?? '').trim(),
      body: String(form.get('body') ?? '').trim()
    };

    this.saving.set(true);
    this.errorMsg.set('');

    this.reviews.addReview(review).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/student/thanks']);
      },
      error: err => {
        this.saving.set(false);
        if (err.status === 401) {
          this.errorMsg.set('Please log in before writing a review.');
        } else {
          this.errorMsg.set(err.error?.error || 'Could not save your review. Try again.');
        }
      }
    });
  }
}