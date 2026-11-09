import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html'
})
export class ThemeToggleComponent {
  // remembers the choice after a refresh
  darkMode = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    this.applyTheme();
  }

  toggle() {
    this.darkMode.set(!this.darkMode());
    localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    this.applyTheme();
  }

  // Bootstrap switches all its colours when this is set on <html>
  private applyTheme() {
    document.documentElement.setAttribute('data-bs-theme', this.darkMode() ? 'dark' : 'light');
  }
}