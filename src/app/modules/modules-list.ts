import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModuleSummary } from '../models/module';
import { FeedbackapiService } from '../services/feedbackapi.service';

@Component({
  selector: 'app-modules-list',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './modules-list.html'
})
export class ModulesListComponent implements OnInit {
  service = inject(FeedbackapiService);
  searchTerm = signal('');
  campus = signal('');
  department = signal('');
  semester = signal('');
  selectedYears = signal<number[]>([]);
  sortBy = signal('name');

  campuses = computed(() => [...new Set(this.service.modules().flatMap(module =>
    module.courseIds.map(course => course.campus)
  ))].sort());

  departments = computed(() => [...new Set(this.service.modules().flatMap(module =>
    module.courseIds.map(course => course.department)
  ))].sort());

  filteredModules = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const filtered = this.service.modules().filter(module => {
      const courseMatches = (!this.campus() && !this.department()) || module.courseIds.some(course =>
        (!this.campus() || course.campus === this.campus()) &&
        (!this.department() || course.department === this.department())
      );
      return (!search || `${module.name} ${module.code}`.toLowerCase().includes(search)) &&
        courseMatches &&
        (!this.selectedYears().length || this.selectedYears().includes(module.year)) &&
        (!this.semester() || String(module.semester) === this.semester());
    });

    return filtered.sort((first, second) => {
      if (this.sortBy() === 'rating') return (second.averageRating ?? -1) - (first.averageRating ?? -1);
      if (this.sortBy() === 'reviews') return second.reviewCount - first.reviewCount;
      return first.name.localeCompare(second.name);
    });
  });

  ngOnInit() {
    this.service.getModules();
  }

  primaryCourse(module: ModuleSummary) {
    return module.courseIds[0];
  }

  updateSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  updateCampus(event: Event) {
    this.campus.set((event.target as HTMLSelectElement).value);
  }

  updateDepartment(event: Event) {
    this.department.set((event.target as HTMLSelectElement).value);
  }

  updateSemester(event: Event) {
    this.semester.set((event.target as HTMLSelectElement).value);
  }

  updateSort(event: Event) {
    this.sortBy.set((event.target as HTMLSelectElement).value);
  }

  toggleYear(year: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedYears.update(years => checked
      ? [...years, year]
      : years.filter(selectedYear => selectedYear !== year));
  }

  clearFilters() {
    this.searchTerm.set('');
    this.campus.set('');
    this.department.set('');
    this.semester.set('');
    this.selectedYears.set([]);
    this.sortBy.set('name');
  }
}