import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { CONTACT_CONFIG } from '../../config/contact.config';
import { GoogleAuthService, type GoogleCredentialResponse } from '../../services/google-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-900">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <span class="text-white font-bold text-2xl">L</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p class="text-slate-600 mt-2">Sign in to your account</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-red-700 text-sm font-medium">{{ errorMessage }}</span>
          </div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-slate-900 placeholder-slate-400"
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-sm text-red-500">
                <ng-container *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</ng-container>
                <ng-container *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</ng-container>
              </p>
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button type="button" (click)="forgotPassword()" class="text-xs font-semibold text-sky-600 hover:text-sky-700">Forgot password?</button>
              </div>
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Enter your password"
                  class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-slate-900 placeholder-slate-400 pr-12"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-sm text-red-500">
                Password is required
              </p>
            </div>

            <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" formControlName="rememberMe" class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
              Remember me on this device
            </label>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
            >
              <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-6 flex items-center gap-3 text-xs text-slate-400"><span class="h-px flex-1 bg-slate-200"></span><span>or continue with</span><span class="h-px flex-1 bg-slate-200"></span></div>
          <div class="mt-4 flex justify-center">
            <div #googleBtn></div>
          </div>

          <!-- Divider -->
          <div class="mt-6 pt-6 border-t-2 border-slate-100 text-center">
            <p class="text-slate-600 text-sm">
              Don't have an account?
              <a routerLink="/signup" class="text-sky-600 hover:text-sky-700 font-semibold ml-1 transition-colors">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleBtn') googleBtnRef?: ElementRef<HTMLDivElement>;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl = '/';

  private destroyed = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private googleAuthService: GoogleAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [true],
    });
  }

  ngOnInit() {
    // Pre-fill email if redirected from "User Already Exists" modal
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.loginForm.patchValue({ email: params['email'] });
      }
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
      const rememberedEmail = localStorage.getItem('remembered_email');
      if (rememberedEmail && !params['email']) this.loginForm.patchValue({ email: rememberedEmail, rememberMe: true });
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        const firstName = response.data?.user?.firstName || 'there';
        const hasLoggedInBefore = localStorage.getItem('has_logged_in_before');

        if (hasLoggedInBefore === 'true') {
          this.toastService.success('Welcome Back 👋', `Welcome back, ${firstName}!`);
        } else {
          this.toastService.success(
            'Welcome 🎉',
            `Welcome to ${CONTACT_CONFIG.brandName}, ${firstName}!`
          );
        }

        localStorage.setItem('has_logged_in_before', 'true');
        if (rememberMe) localStorage.setItem('remembered_email', email);
        else localStorage.removeItem('remembered_email');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }

  forgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email || this.loginForm.get('email')?.invalid) {
      this.loginForm.get('email')?.markAsTouched();
      this.toastService.info('Enter your email', 'Enter the email linked to your account to begin password recovery.');
      return;
    }
    this.authService.forgotPassword(email).subscribe({
      next: () => this.toastService.info('Check your inbox', 'If an account exists, password recovery instructions have been sent.'),
      error: () => this.toastService.info('Check your inbox', 'If an account exists, password recovery instructions have been sent.'),
    });
  }

  ngAfterViewInit() {
    if (!this.googleBtnRef) {
      return;
    }

    this.googleAuthService.renderButton(this.googleBtnRef.nativeElement, (response) =>
      this.handleGoogleCredential(response)
    );
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  private handleGoogleCredential(response: GoogleCredentialResponse) {
    if (this.destroyed) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.googleLogin(response.credential).subscribe({
      next: (res) => {
        const firstName = res.data?.user?.firstName || 'there';
        const hasLoggedInBefore = localStorage.getItem('has_logged_in_before');

        if (hasLoggedInBefore === 'true') {
          this.toastService.success('Welcome Back 👋', `Welcome back, ${firstName}!`);
        } else {
          this.toastService.success('Welcome 🎉', `Welcome to ${CONTACT_CONFIG.brandName}, ${firstName}!`);
        }

        localStorage.setItem('has_logged_in_before', 'true');
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Google sign-in failed. Please try again.';
      },
    });
  }
}
