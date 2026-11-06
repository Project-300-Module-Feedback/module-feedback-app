import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReviewapiService } from '../services/reviewapi.service';

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

  ngOnInit() {
    this.service.getModules();
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
}