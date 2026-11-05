import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback';
import { Course } from '../models/course';
import { ModuleDetail, ModuleSummary } from '../models/module';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackapiService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiURL;
  private _apiBase = this._apiUrl.replace(/feedback\/?$/, '');

  items = signal<Feedback[]>([]);
  courses = signal<Course[]>([]);
  coursesError = signal<boolean>(false);
  modules = signal<ModuleSummary[]>([]);
  modulesLoading = signal<boolean>(false);
  modulesError = signal<boolean>(false);
  selectedModule = signal<ModuleSummary | null>(null);
  moduleReviews = signal<ModuleDetail['reviews']>([]);
  ratingDistribution = signal<ModuleDetail['ratingDistribution']>([]);
  moduleLoading = signal<boolean>(false);
  moduleError = signal<boolean>(false);
  showSuccess = signal<boolean>(false);
  toastError = signal<boolean>(false);
  itemsError = signal<boolean>(false);

  getCourses() {
    this._http.get<Course[]>(`${this._apiBase}courses/`).subscribe({
      next: data => {
        this.courses.set(data);
        this.coursesError.set(false);
      },
      error: () => this.coursesError.set(true)
    });
  }

  getModules() {
    this.modulesLoading.set(true);
    this.modulesError.set(false);
    this._http.get<ModuleSummary[]>(`${this._apiBase}modules/`).subscribe({
      next: data => {
        this.modules.set(data);
        this.modulesLoading.set(false);
      },
      error: () => {
        this.modulesError.set(true);
        this.modulesLoading.set(false);
      }
    });
  }

  getModule(id: string) {
    this.moduleLoading.set(true);
    this.moduleError.set(false);
    this.selectedModule.set(null);
    this.moduleReviews.set([]);
    this.ratingDistribution.set([]);
    this._http.get<ModuleDetail>(`${this._apiBase}modules/${id}`).subscribe({
      next: data => {
        this.selectedModule.set(data.module);
        this.moduleReviews.set(data.reviews);
        this.ratingDistribution.set(data.ratingDistribution);
        this.moduleLoading.set(false);
      },
      error: () => {
        this.moduleError.set(true);
        this.moduleLoading.set(false);
      }
    });
  }

  getItems() {
    this._http.get<Feedback[]>(this._apiUrl).subscribe({
      next: data => {
        this.items.set(data);
        this.itemsError.set(false);
      },
      error: () => this.itemsError.set(true)
    });
  }

  addItem(myComment: string) {
    const feedback = { comment: myComment };
    this._http.post<Feedback[]>(this._apiUrl, feedback).subscribe({
      next: () => {
        this.getItems();
        this.showSuccess.set(true);
        setTimeout(() => this.showSuccess.set(false), 3000);
      },
      error: () => {
        this.toastError.set(true);
        setTimeout(() => this.toastError.set(false), 3500);
      }
    });
  }
}