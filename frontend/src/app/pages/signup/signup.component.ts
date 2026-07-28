import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CONTACT_CONFIG } from '../../config/contact.config';

@Component({
  selector: 'app-signup',
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
            <h1 class="text-3xl font-bold text-slate-900">Create Account</h1>
            <p class="text-slate-600 mt-2">Join Meridian Market today</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-red-700 text-sm font-medium">{{ errorMessage }}</span>
          </div>

          <!-- Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-semibold text-slate-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                formControlName="firstName"
                placeholder="John"
                class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-slate-900 placeholder-slate-400"
                [class.border-red-500]="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched"
              />
              <p *ngIf="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched" class="mt-1 text-sm text-red-500">
                First name is required
              </p>
            </div>

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
                [class.border-red-500]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
              />
              <p *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched" class="mt-1 text-sm text-red-500">
                <ng-container *ngIf="signupForm.get('email')?.errors?.['required']">Email is required</ng-container>
                <ng-container *ngIf="signupForm.get('email')?.errors?.['email']">Please enter a valid email</ng-container>
              </p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="At least 8 characters"
                  class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-slate-900 placeholder-slate-400 pr-12"
                  [class.border-red-500]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
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
              <p *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched" class="mt-1 text-sm text-red-500">
                <ng-container *ngIf="signupForm.get('password')?.errors?.['required']">Password is required</ng-container>
                <ng-container *ngIf="signupForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters</ng-container>
              </p>
              <div class="mt-3" aria-live="polite">
                <div class="flex gap-1"><span *ngFor="let level of [1,2,3,4]" class="h-1 flex-1 rounded" [ngClass]="level <= passwordStrength ? strengthClass : 'bg-slate-200'"></span></div>
                <p class="mt-1 text-xs text-slate-500">Password strength: {{ strengthLabel }}</p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="confirmPassword"
                placeholder="Re-enter your password"
                class="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-slate-900 placeholder-slate-400"
                [class.border-red-500]="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched"
              />
              <p *ngIf="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched" class="mt-1 text-sm text-red-500">
                <ng-container *ngIf="signupForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</ng-container>
                <ng-container *ngIf="signupForm.get('confirmPassword')?.errors?.['passwordsMismatch']">Passwords do not match</ng-container>
              </p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="signupForm.invalid || isLoading"
              class="w-full py-3 px-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25"
            >
              <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-6 pt-6 border-t-2 border-slate-100 text-center">
            <p class="text-slate-600 text-sm">
              Already have an account?
              <a routerLink="/login" class="text-sky-600 hover:text-sky-700 font-semibold ml-1 transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '';
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  get passwordStrength(): number {
    const value = this.signupForm.get('password')?.value || '';
    let score = value.length >= 8 ? 1 : 0;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }

  get strengthLabel() { return ['Very weak', 'Weak', 'Fair', 'Strong', 'Excellent'][this.passwordStrength]; }
  get strengthClass() { return ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-sky-500', 'bg-emerald-500'][this.passwordStrength]; }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { firstName, email, password } = this.signupForm.value;

    this.authService
      .register({ email, password, firstName })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.success(
            'Account Created Successfully 🎉',
            `Welcome to ${CONTACT_CONFIG.brandName}. Your account has been created successfully.`
          );
          // Auto-redirect to login after 2.5 seconds
          setTimeout(() => {
            const queryParams: Record<string, string> = { email };
            if (this.returnUrl) queryParams['returnUrl'] = this.returnUrl;
            this.router.navigate(['/login'], { queryParams });
          }, 2500);
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 400) {
            const emailVal = this.signupForm.get('email')?.value;
            this.toastService.openUserExistsModal(emailVal);
          } else if (err.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else {
            this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
          }
        },
      });
  }
}
