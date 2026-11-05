import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback';
import { Course } from '../models/course';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackapiService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiURL;

  items = signal<Feedback[]>([]);
  courses = signal<Course[]>([]);
  coursesError = signal<boolean>(false);
  showSuccess = signal<boolean>(false);
  toastError = signal<boolean>(false);
  itemsError = signal<boolean>(false);

  getCourses() {
    this._http.get<Course[]>(this._apiUrl.replace(/feedback\/?$/, 'courses/')).subscribe({
      next: data => {
        this.courses.set(data);
        this.coursesError.set(false);
      },
      error: () => this.coursesError.set(true)
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