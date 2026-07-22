import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService, type User } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CONTACT_CONFIG } from '../../config/contact.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 glassmorphism shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 no-underline">
            <div class="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-xl">L</span>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{{ contact.brandName }}</span>
          </a>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" class="text-slate-700 hover:text-sky-600 font-medium transition-colors no-underline">Home</a>
            <a routerLink="/cart" class="text-slate-700 hover:text-sky-600 font-medium transition-colors no-underline">Cart</a>

            <!-- Auth State: Not logged in -->
            <ng-container *ngIf="!currentUser">
              <a routerLink="/login" class="px-4 py-2 border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors no-underline">
                Sign In
              </a>
              <a routerLink="/signup" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors no-underline shadow-md">
                Sign Up
              </a>
            </ng-container>

            <!-- Auth State: Logged in -->
            <ng-container *ngIf="currentUser">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border-2 border-sky-200 rounded-xl">
                <svg class="w-5 h-5 text-sky-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="text-sky-700 font-semibold text-sm">{{ displayName }}</span>
              </div>
              <button
                (click)="logout()"
                class="flex items-center gap-2 px-3 py-1.5 border-2 border-red-300 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </ng-container>

            <!-- Cart Icon with Badge -->
            <button (click)="toggleCart()" class="relative p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Open cart">
              <svg class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span
                *ngIf="cartCount > 0"
                class="absolute -top-1 -right-1 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce"
              >
                {{ cartCount }}
              </span>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button (click)="toggleMobileMenu()" class="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg *ngIf="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <svg *ngIf="mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 animate-fade-in">
          <div class="flex flex-col gap-4">
            <a routerLink="/" class="text-slate-700 hover:text-sky-600 font-medium transition-colors no-underline" (click)="mobileMenuOpen = false">Home</a>
            <a routerLink="/cart" class="text-slate-700 hover:text-sky-600 font-medium transition-colors no-underline" (click)="mobileMenuOpen = false">Cart</a>

            <ng-container *ngIf="!currentUser">
              <a routerLink="/login" class="text-slate-700 hover:text-sky-600 font-medium transition-colors no-underline" (click)="mobileMenuOpen = false">Sign In</a>
              <a routerLink="/signup" class="text-sky-600 hover:text-sky-700 font-semibold transition-colors no-underline" (click)="mobileMenuOpen = false">Sign Up</a>
            </ng-container>

            <ng-container *ngIf="currentUser">
              <div class="flex items-center gap-2 text-slate-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="font-semibold">{{ displayName }}</span>
              </div>
              <button
                (click)="logout(); mobileMenuOpen = false"
                class="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </ng-container>

            <div class="flex items-center gap-2 text-slate-700" (click)="toggleCart(); mobileMenuOpen = false">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Cart ({{ cartCount }})</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  mobileMenuOpen = false;
  currentUser: User | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  readonly contact = CONTACT_CONFIG;

  ngOnInit() {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  get displayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.firstName || this.currentUser.email.split('@')[0];
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.forceLogout();
        this.finishLogout();
      },
      error: () => {
        this.authService.forceLogout();
        this.finishLogout();
      },
    });
  }

  private finishLogout() {
    this.toastService.success('Logged Out Successfully', 'See you again 👋');
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleCart() {
    this.cartService.toggleCart();
  }
}
