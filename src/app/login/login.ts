import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html'
})
export class LoginComponent {
  errorMsg = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  login(email: string, password: string) {
    this.errorMsg.set('');
    this.loading.set(true);

    this.auth.login(email, password).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/modules']);
        }
      },
      error: err => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.error || 'Could not reach the server');
      }
    });
  }
}