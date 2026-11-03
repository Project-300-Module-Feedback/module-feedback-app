import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModuleItem, ModuleReviews } from '../models/review';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewapiService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseURL;

  modules = signal<ModuleItem[]>([]);
  moduleData = signal<ModuleReviews | null>(null);
  summary = signal<string>('');
  summaryLoading = signal<boolean>(false);
  errorMsg = signal<string>('');

  getModules() {
    this._http.get<ModuleItem[]>(`${this._baseUrl}modules`).subscribe({
      next: data => {
        this.modules.set(data);
        this.errorMsg.set('');
      },
      error: () => this.errorMsg.set("Database not active. Modules can't be loaded right now.")
    });
  }

  getModuleReviews(moduleId: string) {
    this.moduleData.set(null);
    this.summary.set('');
    this._http.get<ModuleReviews>(`${this._baseUrl}reviews/module/${moduleId}`).subscribe({
      next: data => {
        this.moduleData.set(data);
        this.errorMsg.set('');
      },
      error: () => this.errorMsg.set('Could not load reviews for this module.')
    });
  }

  getSummary(moduleId: string) {
    this.summaryLoading.set(true);
    this._http.get<{ summary: string }>(`${this._baseUrl}reviews/summary/${moduleId}`).subscribe({
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