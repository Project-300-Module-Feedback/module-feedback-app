import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify.html',
  styleUrl: './verify.css'
})
export class VerifyComponent implements OnInit {
  startEmail = '';
  errorMsg = signal('');
  infoMsg = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // the email comes from the sign up or login page, e.g. /verify?email=s00123456@atu.ie
    this.startEmail = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  verify(event: Event, email: string, code: string) {
    event.preventDefault();
    this.errorMsg.set('');
    this.infoMsg.set('');
    this.loading.set(true);

    this.auth.verify(email.trim().toLowerCase(), code.trim()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { verified: 'yes' } });
      },
      error: err => {
        this.loading.set(false);
        const left = err.error?.attemptsLeft;
        const msg = err.error?.error || 'Could not reach the server';
        this.errorMsg.set(left !== undefined ? `${msg}. ${left} tries left.` : msg);
      }
    });
  }

  // for now the code shows in the backend terminal, not in an email
  resend(email: string) {
    this.errorMsg.set('');
    this.infoMsg.set('');

    this.auth.resend(email.trim().toLowerCase()).subscribe({
      next: () => this.infoMsg.set('A new code has been sent.'),
      error: err => this.errorMsg.set(err.error?.error || 'Could not reach the server')
    });
  }
}