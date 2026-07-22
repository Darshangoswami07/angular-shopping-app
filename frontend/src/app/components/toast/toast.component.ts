import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <div
        *ngFor="let toast of toasts; trackBy: trackById"
        class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in"
        [ngClass]="{
          'bg-slate-900/90 text-white border-emerald-500/50': toast.type === 'success',
          'bg-slate-900/90 text-white border-red-500/50': toast.type === 'error',
          'bg-slate-900/90 text-white border-amber-500/50': toast.type === 'warning',
          'bg-slate-900/90 text-white border-sky-500/50': toast.type === 'info'
        }"
      >
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold tracking-tight text-white mb-0.5">{{ toast.title }}</h4>
          <p class="text-xs text-slate-300 font-medium leading-relaxed">{{ toast.message }}</p>

          <button
            *ngIf="toast.actionLabel && toast.actionFn"
            (click)="toast.actionFn(); remove(toast.id)"
            class="mt-2 text-xs font-semibold text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
          >
            {{ toast.actionLabel }}
          </button>
        </div>

        <!-- Close button -->
        <button
          (click)="remove(toast.id)"
          class="shrink-0 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  remove(id: string) {
    this.toastService.remove(id);
  }

  trackById(index: number, toast: Toast): string {
    return toast.id;
  }
}
