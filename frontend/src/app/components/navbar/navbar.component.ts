import { Component, HostListener, OnDestroy, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService, type User } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CategoryService, type Category } from '../../services/category.service';
import { Product, ProductService } from '../../services/product.service';
import { CONTACT_CONFIG } from '../../config/contact.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
      [ngClass]="scrolled
        ? 'bg-white/90 backdrop-blur-md border-slate-200/80 shadow-sm py-2.5'
        : 'bg-white/70 backdrop-blur-sm border-transparent py-4'"
    >
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-4">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2.5 no-underline group shrink-0">
            <div class="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-sky-600/20 transition-transform group-hover:scale-105">
              <span class="text-white font-black text-lg">M</span>
            </div>
            <span class="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:inline">{{ contact.brandName }}</span>
          </a>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-1 shrink-0">
            <a routerLink="/" routerLinkActive="text-sky-600 after:scale-x-100" [routerLinkActiveOptions]="{ exact: true }"
               class="relative px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors no-underline after:absolute after:left-3.5 after:right-3.5 after:-bottom-0.5 after:h-0.5 after:bg-sky-600 after:rounded-full after:scale-x-0 after:origin-left after:transition-transform">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-sky-600 after:scale-x-100"
               class="relative px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors no-underline after:absolute after:left-3.5 after:right-3.5 after:-bottom-0.5 after:h-0.5 after:bg-sky-600 after:rounded-full after:scale-x-0 after:origin-left after:transition-transform">
              Shop
            </a>

            <!-- Categories mega-menu (live data) -->
            <div class="relative" data-categories-menu>
              <button (click)="categoriesMenuOpen = !categoriesMenuOpen" class="flex items-center gap-1 px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors rounded-lg" [attr.aria-expanded]="categoriesMenuOpen">
                Categories
                <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="categoriesMenuOpen" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div *ngIf="categoriesMenuOpen" class="absolute left-0 mt-2 w-[26rem] rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-900/10 animate-scale-in grid grid-cols-2 gap-1 max-h-96 overflow-y-auto">
                <div *ngIf="categoriesLoading" class="col-span-2 py-6 text-center text-sm text-slate-400">Loading categories…</div>
                <a *ngFor="let category of categories" [routerLink]="['/products']" [queryParams]="{ category: category.id }" (click)="categoriesMenuOpen = false"
                   class="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-sky-700 transition-colors no-underline capitalize truncate">
                  {{ category.name }}
                </a>
              </div>
            </div>
          </div>

          <!-- Search (desktop) -->
          <form class="hidden md:flex flex-1 max-w-md mx-2" (ngSubmit)="onSearch()" data-search-box>
            <div class="relative w-full">
              <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
              <input [(ngModel)]="searchQuery" (ngModelChange)="onSearchInput($event)" (focus)="showSuggestions = searchQuery.trim().length > 1"
                     name="search" type="search" placeholder="Search products, brands…" autocomplete="off"
                     class="w-full pl-9 pr-3 py-2 text-sm bg-slate-100/80 border border-transparent rounded-xl focus:bg-white focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all" />

              <div *ngIf="showSuggestions" class="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden z-50 animate-scale-in">
                <div *ngIf="suggestionsLoading" class="px-4 py-3 text-sm text-slate-400">Searching…</div>
                <ng-container *ngIf="!suggestionsLoading">
                  <a *ngFor="let s of suggestions" [routerLink]="['/product', s.id]" (click)="selectSuggestion()"
                     class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors no-underline">
                    <img [src]="s.thumbnail || (s.images.length ? s.images[0].url : '') || 'assets/images/placeholder.jpg'" [alt]="s.name" class="h-9 w-9 rounded-lg object-cover shrink-0 bg-slate-100">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-800 truncate">{{ s.name }}</p>
                      <p class="text-xs text-slate-400 capitalize">{{ s.category.name }}</p>
                    </div>
                  </a>
                  <p *ngIf="!suggestions.length" class="px-4 py-3 text-sm text-slate-400">No matches for "{{ searchQuery }}"</p>
                  <button *ngIf="suggestions.length" type="submit" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors border-t border-slate-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
                    See all results for "{{ searchQuery }}"
                  </button>
                </ng-container>
              </div>
            </div>
          </form>

          <!-- Right actions -->
          <div class="hidden md:flex items-center gap-2 ml-auto shrink-0">
            <!-- Not logged in -->
            <ng-container *ngIf="!currentUser">
              <a routerLink="/login" class="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 font-semibold transition-colors no-underline">
                Sign In
              </a>
              <a routerLink="/signup" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors no-underline shadow-sm">
                Sign Up
              </a>
            </ng-container>

            <!-- Logged in -->
            <ng-container *ngIf="currentUser">
              <div class="relative" data-profile-menu>
                <button (click)="profileMenuOpen=!profileMenuOpen" class="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-slate-100 transition-colors" aria-label="Open account menu" [attr.aria-expanded]="profileMenuOpen">
                  <span class="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 font-black text-white text-sm shadow-sm">{{ avatarInitial }}</span>
                  <svg class="w-3.5 h-3.5 text-slate-500 transition-transform" [class.rotate-180]="profileMenuOpen" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div *ngIf="profileMenuOpen" class="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-900/10 animate-scale-in">
                  <div class="px-3 py-3 mb-1 border-b border-slate-100">
                    <p class="text-sm font-bold text-slate-900 truncate">{{ displayName }}</p>
                    <p class="text-xs text-slate-500 truncate mt-0.5">{{ currentUser.email }}</p>
                  </div>
                  <a *ngFor="let link of accountLinks" [routerLink]="link.url.split('?')[0]" [queryParams]="link.queryParams" (click)="profileMenuOpen=false"
                     class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-sky-700 transition-colors">
                    <span class="text-slate-400" [innerHTML]="link.iconHtml"></span>
                    {{ link.label }}
                  </a>
                  <div class="my-1 border-t border-slate-100"></div>
                  <button (click)="logout()" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            </ng-container>

            <!-- Wishlist Icon with Badge -->
            <a routerLink="/profile" [queryParams]="{ tab: 'wishlist' }" class="relative p-2 hover:bg-slate-100 rounded-xl transition-colors no-underline" aria-label="Open wishlist">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span
                *ngIf="wishlistCount > 0"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {{ wishlistCount }}
              </span>
            </a>

            <!-- Cart Icon with Badge -->
            <button (click)="toggleCart()" class="relative p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Open cart">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span
                *ngIf="cartCount > 0"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
            </button>
          </div>

          <!-- Mobile: search + wishlist + cart + menu buttons -->
          <div class="flex items-center gap-0.5 md:hidden ml-auto">
            <button (click)="mobileSearchOpen = !mobileSearchOpen" class="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Search">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
            </button>
            <a routerLink="/profile" [queryParams]="{ tab: 'wishlist' }" class="relative p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Open wishlist">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span *ngIf="wishlistCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{{ wishlistCount }}</span>
            </a>
            <button (click)="toggleCart()" class="relative p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Open cart">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span *ngIf="cartCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-sky-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{{ cartCount }}</span>
            </button>
            <button (click)="toggleMobileMenu()" class="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Open menu">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile search bar -->
        <form *ngIf="mobileSearchOpen" class="md:hidden mt-3 animate-fade-in" (ngSubmit)="onSearch(); mobileSearchOpen = false">
          <div class="relative w-full">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
            <input [(ngModel)]="searchQuery" name="mobileSearch" type="search" placeholder="Search products, brands…" autofocus
                   class="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-100/80 border border-transparent rounded-xl focus:bg-white focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all" />
          </div>
        </form>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div *ngIf="mobileMenuOpen" class="fixed inset-0 z-[60] md:hidden">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" (click)="toggleMobileMenu()"></div>
      <div class="absolute top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl flex flex-col animate-slide-in">
        <div class="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <span class="text-lg font-extrabold text-slate-900">Menu</span>
          <button (click)="toggleMobileMenu()" class="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Close menu">
            <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-5">
          <div *ngIf="currentUser" class="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <span class="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 font-black text-white shadow-sm">{{ avatarInitial }}</span>
            <div class="min-w-0">
              <p class="font-bold text-slate-900 truncate">{{ displayName }}</p>
              <p class="text-xs text-slate-500 truncate">{{ currentUser.email }}</p>
            </div>
          </div>

          <nav class="flex flex-col gap-1">
            <a routerLink="/" routerLinkActive="bg-sky-50 text-sky-700" [routerLinkActiveOptions]="{ exact: true }"
               class="px-3.5 py-3 rounded-xl text-slate-700 font-semibold transition-colors no-underline" (click)="toggleMobileMenu()">Home</a>
            <a routerLink="/products" routerLinkActive="bg-sky-50 text-sky-700"
               class="px-3.5 py-3 rounded-xl text-slate-700 font-semibold transition-colors no-underline" (click)="toggleMobileMenu()">Shop</a>

            <div class="my-2 border-t border-slate-100"></div>
            <p class="px-3.5 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categories</p>
            <a *ngFor="let category of categories.slice(0, 6)" [routerLink]="['/products']" [queryParams]="{ category: category.id }" (click)="toggleMobileMenu()"
               class="px-3.5 py-2.5 rounded-xl text-slate-600 font-medium transition-colors no-underline hover:bg-slate-50 capitalize">
              {{ category.name }}
            </a>

            <ng-container *ngIf="currentUser">
              <div class="my-2 border-t border-slate-100"></div>
              <a *ngFor="let link of accountLinks" [routerLink]="link.url.split('?')[0]" [queryParams]="link.queryParams" (click)="toggleMobileMenu()"
                 class="flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-700 font-semibold transition-colors no-underline hover:bg-slate-50">
                <span class="text-slate-400" [innerHTML]="link.iconHtml"></span>
                {{ link.label }}
              </a>
            </ng-container>
          </nav>
        </div>

        <div class="px-5 py-5 border-t border-slate-100">
          <ng-container *ngIf="!currentUser">
            <a routerLink="/login" (click)="toggleMobileMenu()" class="block text-center py-3 mb-2 border border-slate-300 text-slate-800 font-bold rounded-xl no-underline">Sign In</a>
            <a routerLink="/signup" (click)="toggleMobileMenu()" class="block text-center py-3 bg-slate-900 text-white font-bold rounded-xl no-underline">Sign Up</a>
          </ng-container>
          <button *ngIf="currentUser" (click)="logout(); toggleMobileMenu()" class="w-full flex items-center justify-center gap-2 py-3 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  wishlistCount = 0;
  mobileMenuOpen = false;
  mobileSearchOpen = false;
  profileMenuOpen = false;
  categoriesMenuOpen = false;
  scrolled = false;
  currentUser: User | null = null;
  searchQuery = '';
  categories: Category[] = [];
  categoriesLoading = true;

  suggestions: Product[] = [];
  suggestionsLoading = false;
  showSuggestions = false;

  readonly contact = CONTACT_CONFIG;

  readonly accountLinks: Array<{ label: string; url: string; queryParams: Record<string, string>; iconHtml: SafeHtml }>;

  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastService: ToastService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    // These SVGs are static strings authored in this file, not user input, so
    // bypassing sanitization here is safe. Angular's default HTML sanitizer
    // strips <svg>/<path> tags from a plain [innerHTML] binding, which is why
    // this needs an explicit SafeHtml rather than a raw string.
    const trust = (svg: string) => this.sanitizer.bypassSecurityTrustHtml(svg);
    this.accountLinks = [
      { label: 'My Profile', url: '/profile', queryParams: {}, iconHtml: trust('<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>') },
      { label: 'My Orders', url: '/profile', queryParams: { tab: 'orders' }, iconHtml: trust('<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>') },
      { label: 'Wishlist', url: '/profile', queryParams: { tab: 'wishlist' }, iconHtml: trust('<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>') },
      { label: 'Saved Addresses', url: '/profile', queryParams: { tab: 'addresses' }, iconHtml: trust('<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>') },
      { label: 'Account Settings', url: '/profile', queryParams: { tab: 'settings' }, iconHtml: trust('<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>') },
    ];
  }

  ngOnInit() {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.wishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount = count;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data
          .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0))
          .slice(0, 12);
        this.categoriesLoading = false;
      },
      error: () => {
        this.categoriesLoading = false;
      },
    });

    if (typeof window !== 'undefined') {
      this.scrolled = window.scrollY > 8;
    }

    this.searchInput$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim().length < 2) return of<Product[]>([]);
          this.suggestionsLoading = true;
          return this.productService.getProducts({ search: query.trim(), limit: 6, isActive: true }).pipe(
            switchMap((res) => of(res.data.products))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((products) => {
        this.suggestionsLoading = false;
        this.suggestions = products;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get displayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.firstName || this.currentUser.email.split('@')[0];
  }

  get avatarInitial(): string {
    return this.displayName.charAt(0).toUpperCase();
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (!query) return;
    this.showSuggestions = false;
    this.router.navigate(['/products'], { queryParams: { search: query } });
  }

  onSearchInput(value: string) {
    const query = value.trim();
    this.showSuggestions = query.length > 1;
    this.searchInput$.next(query);
  }

  selectSuggestion() {
    this.showSuggestions = false;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 8;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-profile-menu]')) this.profileMenuOpen = false;
    if (!target.closest('[data-categories-menu]')) this.categoriesMenuOpen = false;
    if (!target.closest('[data-search-box]')) this.showSuggestions = false;
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
