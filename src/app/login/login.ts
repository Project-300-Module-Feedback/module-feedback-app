import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  errorMsg = signal('');
  infoMsg = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // already logged in, no need to see the login page
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.auth.homePage()]);
      return;
    }

    // came here from the verify page
    if (this.route.snapshot.queryParamMap.get('verified')) {
      this.infoMsg.set('Email verified. You can log in now.');
    }
  }

  login(event: Event, email: string, password: string) {
    event.preventDefault();
    this.errorMsg.set('');
    this.infoMsg.set('');
    this.loading.set(true);

    email = email.trim().toLowerCase();

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        // student -> modules, lecturer -> dashboard, admin -> admin page
        this.router.navigate([this.auth.homePage()]);
      },
      error: err => {
        this.loading.set(false);
        // account made but email not verified yet, send them to the code page
        if (err.status === 403) {
          this.router.navigate(['/verify'], { queryParams: { email } });
          return;
        }
        this.errorMsg.set(err.error?.error || 'Could not reach the server');
      }
    });
  }
}