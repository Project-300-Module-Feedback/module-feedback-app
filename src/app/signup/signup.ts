import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  errorMsg = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  signup(event: Event, email: string, password: string, confirm: string) {
    event.preventDefault();
    this.errorMsg.set('');

    email = email.trim().toLowerCase();

    // quick checks before we bother the server
    if (!email.endsWith('@atu.ie')) {
      this.errorMsg.set('Please use your @atu.ie email');
      return;
    }
    if (password.length < 8) {
      this.errorMsg.set('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      this.errorMsg.set('Passwords do not match');
      return;
    }

    this.loading.set(true);

    this.auth.register(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        // next step is typing in the 6 digit code
        this.router.navigate(['/verify'], { queryParams: { email } });
      },
      error: err => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.error || 'Could not reach the server');
      }
    });
  }
}