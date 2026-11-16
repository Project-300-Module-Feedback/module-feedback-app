import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './admin-stats.html'
})
export class AdminStatsComponent implements OnInit {
  constructor(public service: FeedbackapiService) {}

  ngOnInit() {
    this.service.getModules();
  }

  // all reviews across every module
  get totalReviews() {
    return this.service.modules().reduce((sum, module) => sum + module.reviewCount, 0);
  }

  // average of every review, so modules with more reviews count more
  get averageRating() {
    const rated = this.service.modules().filter(module => module.averageRating !== null);
    const count = rated.reduce((sum, module) => sum + module.reviewCount, 0);
    if (!count) return null;
    return rated.reduce((sum, module) => sum + module.averageRating! * module.reviewCount, 0) / count;
  }

  get recommendPercent() {
    const rated = this.service.modules().filter(module => module.recommendedPercentage !== null);
    const count = rated.reduce((sum, module) => sum + module.reviewCount, 0);
    if (!count) return null;
    return Math.round(rated.reduce((sum, module) => sum + module.recommendedPercentage! * module.reviewCount, 0) / count);
  }
}