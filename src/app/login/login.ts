import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html'
})
export class LoginComponent {
  errorMsg = '';

  constructor(private router: Router) {}

  login(username: string, password: string) {
    if (username === 'student' && password === 'student123') {
      this.router.navigate(['/modules']);
    } else if (username === 'admin' && password === 'admin123') {
      this.router.navigate(['/admin']);
    } else {
      this.errorMsg = 'Wrong username or password';
    }
  }
}