import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface StoredSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const stored = localStorage.getItem('session');
    if (stored) {
      try {
        const session: StoredSession = JSON.parse(stored);
        this.currentUserSubject.next(session.user);
      } catch {
        localStorage.removeItem('session');
      }
    }
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, credentials)
      .pipe(
        tap((response) => {
          this.setSession(response.data.user, response.data.accessToken, response.data.refreshToken);
        })
      );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setSession(response.data.user, response.data.accessToken, response.data.refreshToken);
        })
      );
  }

  logout(): Observable<{ status: string; message: string }> {
    return this.http
      .post<{ status: string; message: string }>(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/refresh-token`, {})
      .pipe(
        tap((response) => {
          this.setSession(response.data.user, response.data.accessToken, response.data.refreshToken);
        })
      );
  }

  forgotPassword(
    email: string
  ): Observable<{ status: string; message: string; data: { resetToken: string } }> {
    return this.http.post<{
      status: string;
      message: string;
      data: { resetToken: string };
    }>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(
    token: string,
    password: string
  ): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.apiUrl}/auth/reset-password`,
      { token, password }
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.apiUrl}/auth/change-password`,
      {
        currentPassword,
        newPassword,
      }
    );
  }

  getProfile(): Observable<{ status: string; data: User }> {
    return this.http
      .get<{ status: string; data: User }>(`${this.apiUrl}/auth/profile`)
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.data);
        })
      );
  }

  private setSession(user: User, accessToken: string, refreshToken: string) {
    const session: StoredSession = { user, accessToken, refreshToken };
    localStorage.setItem('session', JSON.stringify(session));
    this.currentUserSubject.next(user);
  }

  private clearSession() {
    localStorage.removeItem('session');
    this.currentUserSubject.next(null);
  }

  get accessToken(): string | null {
    const stored = localStorage.getItem('session');
    if (stored) {
      try {
        const session: StoredSession = JSON.parse(stored);
        return session.accessToken;
      } catch {
        return null;
      }
    }
    return null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  forceLogout() {
    this.clearSession();
  }
}
