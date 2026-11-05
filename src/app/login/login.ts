import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html'
})
export class LoginComponent {
  private router = inject(Router);

  errorMsg = signal<string>('');

  login(username: string, password: string) {
    if (username === 'student' && password === 'student123') {
      this.router.navigate(['/modules']);
    } else if (username === 'admin' && password === 'admin123') {
      this.router.navigate(['/admin']);
    } else {
      this.errorMsg.set('Wrong username or password');
    }
  }
}