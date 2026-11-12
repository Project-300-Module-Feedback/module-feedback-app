import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReviewapiService } from '../services/reviewapi.service';
import { ReviewStats } from '../models/review';

@Component({
  selector: 'app-modulereviews',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './modulereviews.html',
  styleUrl: './modulereviews.css'
})
export class ModulereviewsComponent implements OnInit {
  constructor(public service: ReviewapiService) {}

  selectedId = '';

  // the rating cards at the top of the dashboard, add more here if needed
  ratingCards: { key: keyof ReviewStats; label: string }[] = [
    { key: 'overall', label: 'Overall' },
    { key: 'teaching', label: 'Teaching' },
    { key: 'content', label: 'Content' },
    { key: 'assessmentFairness', label: 'Assessment fairness' }
  ];

  ngOnInit() {
    this.service.getModules();
  }

  get selectedModule() {
    return this.service.modules().find(module => module._id === this.selectedId);
  }

  pickModule(moduleId: string) {
    this.selectedId = moduleId;
    if (moduleId) {
      this.service.getModuleReviews(moduleId);
    } else {
      this.service.moduleData.set(null);
    }
  }

  summarise() {
    this.service.getSummary(this.selectedId);
  }

  // turns a rating out of 5 into a % for the progress bars
  outOfFive(value: number | null) {
    return value === null ? 0 : (value / 5) * 100;
  }

  // % of reviews that gave this many stars
  ratingShare(count: number) {
    const total = this.service.moduleData()?.count ?? 0;
    return total ? (count / total) * 100 : 0;
  }
}