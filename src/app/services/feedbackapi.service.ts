import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback';
import { Course } from '../models/course';
import { ModuleDetail, ModuleSummary } from '../models/module';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackapiService {
  private apiUrl = environment.apiURL;
  private apiBase = this.apiUrl.replace(/feedback\/?$/, '');

  constructor(private http: HttpClient) {}

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
  summary = signal<string>('');
  summaryLoading = signal<boolean>(false);

  getCourses() {
    this.http.get<Course[]>(`${this.apiBase}courses/`).subscribe({
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
    this.http.get<ModuleSummary[]>(`${this.apiBase}modules/`).subscribe({
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
    this.http.get<ModuleDetail>(`${this.apiBase}modules/${id}`).subscribe({
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
    this.http.get<Feedback[]>(this.apiUrl).subscribe({
      next: data => {
        this.items.set(data);
        this.itemsError.set(false);
      },
      error: () => this.itemsError.set(true)
    });
  }

  addItem(myComment: string) {
    const feedback = { comment: myComment };
    this.http.post<Feedback[]>(this.apiUrl, feedback).subscribe({
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

  getSummary() {
    this.summaryLoading.set(true);
    this.http.get<{ summary: string }>(this.apiUrl + 'summary').subscribe({
      next: data => {
        this.summary.set(data.summary);
        this.summaryLoading.set(false);
      },
      error: err => {
        this.summary.set(err.error?.error || 'Could not make a summary right now.');
        this.summaryLoading.set(false);
      }
    });
  }
}