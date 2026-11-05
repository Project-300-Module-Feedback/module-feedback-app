import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackapiService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiURL;

  items = signal<Feedback[]>([]);
  showSuccess = signal<boolean>(false);
  toastError = signal<boolean>(false);
  itemsError = signal<boolean>(false);
  summary = signal<string>('');
  summaryLoading = signal<boolean>(false);

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

  getSummary() {
    this.summaryLoading.set(true);
    this._http.get<{ summary: string }>(this._apiUrl + 'summary').subscribe({
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