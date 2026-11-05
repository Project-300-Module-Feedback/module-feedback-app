import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './module-detail.html'
})
export class ModuleDetailComponent implements OnInit {
  constructor(public service: FeedbackapiService, private route: ActivatedRoute) {}

  get ratingCounts() {
    return [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: this.service.ratingDistribution().find(item => item.rating === rating)?.count ?? 0
    }));
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.service.getModule(id);
    });
  }
}