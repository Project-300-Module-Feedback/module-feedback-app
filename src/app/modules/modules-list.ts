import { Component, OnInit } from '@angular/core';
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
  searchTerm = '';
  campus = '';
  department = '';
  semester = '';
  selectedYears: number[] = [];
  sortBy = 'name';

  constructor(public service: FeedbackapiService) {}

  get campuses() {
    const campuses = this.service.modules().flatMap(module =>
      module.courseIds.map(course => course.campus)
    );
    return [...new Set(campuses)].sort();
  }

  get departments() {
    const departments = this.service.modules().flatMap(module =>
      module.courseIds.map(course => course.department)
    );
    return [...new Set(departments)].sort();
  }

  get filteredModules() {
    const search = this.searchTerm.trim().toLowerCase();
    const filtered = this.service.modules().filter(module => {
      const courseMatches = (!this.campus && !this.department) || module.courseIds.some(course =>
        (!this.campus || course.campus === this.campus) &&
        (!this.department || course.department === this.department)
      );
      return (!search || `${module.name} ${module.code}`.toLowerCase().includes(search)) &&
        courseMatches &&
        (!this.selectedYears.length || this.selectedYears.includes(module.year)) &&
        (!this.semester || String(module.semester) === this.semester);
    });

    return filtered.sort((first, second) => {
      if (this.sortBy === 'rating') return (second.averageRating ?? -1) - (first.averageRating ?? -1);
      if (this.sortBy === 'reviews') return second.reviewCount - first.reviewCount;
      return first.name.localeCompare(second.name);
    });
  }

  ngOnInit() {
    this.service.getModules();
  }

  primaryCourse(module: ModuleSummary) {
    return module.courseIds[0];
  }

  updateSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  updateCampus(event: Event) {
    this.campus = (event.target as HTMLSelectElement).value;
  }

  updateDepartment(event: Event) {
    this.department = (event.target as HTMLSelectElement).value;
  }

  updateSemester(event: Event) {
    this.semester = (event.target as HTMLSelectElement).value;
  }

  updateSort(event: Event) {
    this.sortBy = (event.target as HTMLSelectElement).value;
  }

  toggleYear(year: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedYears = checked
      ? [...this.selectedYears, year]
      : this.selectedYears.filter(selectedYear => selectedYear !== year);
  }

  clearFilters() {
    this.searchTerm = '';
    this.campus = '';
    this.department = '';
    this.semester = '';
    this.selectedYears = [];
    this.sortBy = 'name';
  }
}