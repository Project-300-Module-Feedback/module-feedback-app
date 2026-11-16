import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'student' | 'lecturer' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseURL;
  user = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}auth/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.user.set(res.user);
        })
      );
  }

  // makes the account, the backend then sends a 6 digit code
  register(email: string, password: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}auth/register`, { email, password });
  }

  verify(email: string, code: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}auth/verify`, { email, code });
  }

  resend(email: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}auth/resend`, { email });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // true if there's a token and it hasn't run out yet (it lasts 1 day)
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || !this.user()) return false;

    try {
      // the middle part of the token holds the expiry time
      const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(part));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // where each role goes after logging in
  homePage(): string {
    const role = this.user()?.role;
    if (role === 'admin') return '/admin';
    if (role === 'lecturer') return '/lecturer';
    return '/modules';
  }

  private loadUser(): AuthUser | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }
}