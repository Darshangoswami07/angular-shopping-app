import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService, UserExistsModalState } from '../../services/toast.service';

@Component({
  selector: 'app-user-exists-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="modalState.isOpen"
      class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 transform transition-all scale-100">
        <!-- Header / Icon -->
        <div class="text-center">
          <div class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">User Already Exists</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">
            An account with <strong class="text-slate-900 font-semibold">{{ modalState.email || 'this email' }}</strong> already exists. Please sign in instead.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            (click)="goToLogin()"
            class="flex-1 py-3 px-5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Go to Login
          </button>
          <button
            (click)="close()"
            class="py-3 px-5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UserExistsModalComponent implements OnInit {
  modalState: UserExistsModalState = { isOpen: false };

  constructor(
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.toastService.userExistsModal$.subscribe((state) => {
      this.modalState = state;
    });
  }

  goToLogin() {
    const email = this.modalState.email;
    this.toastService.closeUserExistsModal();
    this.router.navigate(['/login'], { queryParams: { email } });
  }

  close() {
    this.toastService.closeUserExistsModal();
  }
}
