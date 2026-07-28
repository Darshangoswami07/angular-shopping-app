import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService, AuthPromptModalState } from '../../services/toast.service';

@Component({
  selector: 'app-auth-prompt-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="modalState.isOpen"
      class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      (click)="close()"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 transform transition-all scale-100"
        (click)="$event.stopPropagation()"
      >
        <div class="text-center">
          <div class="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-600 shadow-inner">
            <svg *ngIf="modalState.action === 'wishlist'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg *ngIf="modalState.action === 'cart'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <svg *ngIf="modalState.action === 'general'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ title }}</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">{{ message }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            (click)="goToLogin()"
            class="flex-1 py-3 px-5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Log In
          </button>
          <button
            (click)="goToSignup()"
            class="flex-1 py-3 px-5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Create Account
          </button>
        </div>
        <button (click)="close()" class="mt-4 w-full text-center text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  `,
})
export class AuthPromptModalComponent implements OnInit {
  modalState: AuthPromptModalState = { isOpen: false };

  constructor(
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.toastService.authPromptModal$.subscribe((state) => {
      this.modalState = state;
    });
  }

  get title(): string {
    switch (this.modalState.action) {
      case 'wishlist':
        return 'Sign In to Save Favorites';
      case 'cart':
        return 'Sign In to Add to Cart';
      default:
        return 'Sign In Required';
    }
  }

  get message(): string {
    switch (this.modalState.action) {
      case 'wishlist':
        return 'Create a free account or sign in to save items to your wishlist and pick up right where you left off.';
      case 'cart':
        return 'Create a free account or sign in to add items to your cart and check out securely.';
      default:
        return 'Please sign in or create a free account to continue.';
    }
  }

  private navigate(path: string) {
    const returnUrl = this.modalState.returnUrl;
    this.toastService.closeAuthPrompt();
    this.router.navigate([path], returnUrl ? { queryParams: { returnUrl } } : {});
  }

  goToLogin() {
    this.navigate('/login');
  }

  goToSignup() {
    this.navigate('/signup');
  }

  close() {
    this.toastService.closeAuthPrompt();
  }
}
