import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AddressService, Address } from '../../services/address.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen pt-24 pb-16 bg-gradient-to-b from-slate-100 to-slate-50">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          <!-- ============ Sidebar ============ -->
          <aside class="lg:sticky lg:top-24 space-y-4">
            <div class="bg-white rounded-3xl shadow-xl border border-slate-200/70 overflow-hidden">
              <div class="h-20 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 relative">
                <div class="absolute -bottom-9 left-6 w-[72px] h-[72px] rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-xl">
                  {{ userInitial }}
                </div>
              </div>
              <div class="pt-12 pb-5 px-6">
                <div class="flex items-center gap-2">
                  <h1 class="text-lg font-extrabold text-slate-900 tracking-tight truncate">{{ displayName }}</h1>
                  <svg *ngIf="user?.emailVerified" class="w-4 h-4 text-sky-500 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-label="Verified">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <p class="text-slate-500 text-xs mt-0.5 truncate">{{ user?.email }}</p>
                <div class="flex items-center gap-2 mt-3">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-700 uppercase tracking-wider">{{ user?.role || 'CUSTOMER' }}</span>
                  <span *ngIf="memberSince" class="text-[10px] font-semibold text-slate-400">Member since {{ memberSince }}</span>
                </div>

                <!-- Completion -->
                <div class="mt-5">
                  <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    <span>Profile Strength</span>
                    <span class="text-sky-600">{{ completionPercentage }}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500" [style.width.%]="completionPercentage"></div>
                  </div>
                </div>

                <!-- Quick stats -->
                <div class="grid grid-cols-3 gap-2 mt-5 text-center">
                  <div class="bg-slate-50 rounded-xl py-2.5">
                    <div class="text-base font-black text-slate-900">{{ orders.length }}</div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Orders</div>
                  </div>
                  <div class="bg-slate-50 rounded-xl py-2.5">
                    <div class="text-base font-black text-slate-900">{{ wishlistItems.length }}</div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Wishlist</div>
                  </div>
                  <div class="bg-slate-50 rounded-xl py-2.5">
                    <div class="text-base font-black text-slate-900">{{ addresses.length }}</div>
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Addresses</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nav -->
            <nav class="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-2.5">
              <button *ngFor="let tab of tabs" (click)="selectTab(tab.id)"
                      class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all mb-1 last:mb-0"
                      [ngClass]="activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'">
                <span class="shrink-0" [ngSwitch]="tab.id">
                  <svg *ngSwitchCase="'profile'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  <svg *ngSwitchCase="'orders'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  <svg *ngSwitchCase="'wishlist'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  <svg *ngSwitchCase="'addresses'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <svg *ngSwitchCase="'settings'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </span>
                <span class="flex-1 text-left">{{ tab.label }}</span>
                <span *ngIf="tab.id === 'orders' && orders.length" class="text-[10px] font-black px-2 py-0.5 rounded-full" [ngClass]="activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'">{{ orders.length }}</span>
                <span *ngIf="tab.id === 'wishlist' && wishlistItems.length" class="text-[10px] font-black px-2 py-0.5 rounded-full" [ngClass]="activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'">{{ wishlistItems.length }}</span>
              </button>
            </nav>

            <button (click)="logout()" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-red-50 text-red-600 border border-slate-200/70 hover:border-red-200 font-bold rounded-2xl text-sm shadow-xl transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </aside>

          <!-- ============ Content ============ -->
          <main>

            <!-- Tab 1: My Profile -->
            <section *ngIf="activeTab === 'profile'" class="bg-white rounded-3xl shadow-xl border border-slate-200/70 overflow-hidden">
              <header class="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
                <h2 class="text-xl font-extrabold text-slate-900">Personal Details</h2>
                <p class="text-sm text-slate-500 mt-1">Keep your contact information up to date so we can reach you about your orders.</p>
              </header>
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
                  <input formControlName="firstName" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-slate-900 transition-shadow" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                  <input formControlName="lastName" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-slate-900 transition-shadow" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                  <input formControlName="email" type="email" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-slate-900 transition-shadow" />
                  <p class="text-xs text-slate-400 mt-1.5">This is also the email you sign in with, and the one used on your saved addresses.</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                  <input formControlName="phone" type="tel" placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none text-slate-900 transition-shadow" />
                </div>
                <div class="sm:col-span-2 flex items-center gap-3 pt-2">
                  <button type="submit" [disabled]="isSavingProfile || profileForm.invalid" class="py-3 px-8 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60 flex items-center gap-2">
                    <svg *ngIf="isSavingProfile" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    {{ isSavingProfile ? 'Saving Changes...' : 'Save Profile' }}
                  </button>
                </div>
              </form>
            </section>

            <!-- Tab 2: My Orders -->
            <section *ngIf="activeTab === 'orders'" class="bg-white rounded-3xl shadow-xl border border-slate-200/70 overflow-hidden">
              <header class="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 class="text-xl font-extrabold text-slate-900">Order History</h2>
                  <p class="text-sm text-slate-500 mt-1">Track deliveries and manage your recent purchases.</p>
                </div>
                <div class="flex gap-2 text-xs font-bold">
                  <span class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">{{ orders.length }} Total</span>
                  <span *ngIf="activeOrderCount" class="px-3 py-1.5 rounded-full bg-sky-100 text-sky-700">{{ activeOrderCount }} Active</span>
                </div>
              </header>

              <div class="p-6 sm:p-8">
                <div *ngIf="isLoadingOrders" class="space-y-4">
                  <div *ngFor="let _ of [1,2]" class="h-20 rounded-2xl bg-slate-100 animate-pulse"></div>
                </div>

                <div *ngIf="!isLoadingOrders && orders.length === 0" class="text-center py-16">
                  <div class="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <svg class="w-9 h-9 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p class="text-slate-900 font-bold">No orders found yet</p>
                  <p class="text-slate-500 text-sm mt-1">When you place an order, it will show up here with live tracking.</p>
                  <a routerLink="/" class="mt-5 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors">Start Shopping</a>
                </div>

                <div *ngIf="orders.length > 0" class="space-y-4">
                  <div *ngFor="let order of orders" class="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <!-- Order summary row -->
                    <button type="button" (click)="toggleOrder(order.id)" class="w-full p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors">
                      <div class="flex items-start gap-4">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" [ngClass]="statusIconClass(order.status)">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path *ngIf="order.status === 'DELIVERED'" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                            <path *ngIf="order.status === 'SHIPPED'" stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-2-1a1 1 0 011-1m5 1a1 1 0 102 0 1 1 0 00-2 0zM7 17a1 1 0 102 0 1 1 0 00-2 0z"/>
                            <path *ngIf="order.status === 'PROCESSING'" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            <path *ngIf="order.status === 'PENDING'" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            <path *ngIf="order.status === 'CANCELLED' || order.status === 'REFUNDED'" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </div>
                        <div>
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="font-bold text-slate-900">#{{ order.orderNumber }}</span>
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide" [ngClass]="statusBadgeClass(order.status)">{{ order.status }}</span>
                            <span *ngIf="order.paymentMethod === 'COD'" class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-700">Cash on Delivery</span>
                          </div>
                          <span class="text-xs text-slate-500 mt-1 block">
                            {{ order.createdAt | date:'mediumDate' }} • {{ order.items.length }} item(s)
                            <ng-container *ngIf="order.trackingNumber"> • Tracking: <span class="font-semibold text-slate-700">{{ order.trackingNumber }}</span></ng-container>
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center gap-4 pl-14 sm:pl-0">
                        <span class="text-lg font-black text-slate-900">\${{ order.total | number:'1.2-2' }}</span>
                        <svg class="w-5 h-5 text-slate-400 transition-transform" [class.rotate-180]="expandedOrderId === order.id" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    <!-- Expanded detail: tracking timeline + items -->
                    <div *ngIf="expandedOrderId === order.id" class="border-t border-slate-100 p-5 sm:p-6 bg-slate-50/60">
                      <!-- Cancelled/refunded banner -->
                      <div *ngIf="order.status === 'CANCELLED' || order.status === 'REFUNDED'" class="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                        This order was {{ order.status === 'CANCELLED' ? 'cancelled' : 'refunded' }} and is no longer being processed.
                      </div>

                      <!-- Tracking stepper -->
                      <div *ngIf="order.status !== 'CANCELLED' && order.status !== 'REFUNDED'" class="mb-8 overflow-x-auto">
                        <div class="flex items-center min-w-[420px]">
                          <ng-container *ngFor="let step of order.trackingSteps; let i = index; let last = last">
                            <div class="flex flex-col items-center text-center w-20 shrink-0">
                              <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2"
                                   [ngClass]="{
                                     'bg-emerald-500 border-emerald-500 text-white': step.state === 'done',
                                     'bg-sky-600 border-sky-600 text-white animate-pulse': step.state === 'current',
                                     'bg-white border-slate-300 text-slate-400': step.state === 'upcoming'
                                   }">
                                <svg *ngIf="step.state === 'done'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                <span *ngIf="step.state !== 'done'">{{ i + 1 }}</span>
                              </div>
                              <span class="text-[11px] font-bold mt-2" [class.text-slate-900]="step.state !== 'upcoming'" [class.text-slate-400]="step.state === 'upcoming'">{{ step.label }}</span>
                              <span *ngIf="step.date" class="text-[10px] text-slate-500 mt-0.5">{{ step.date | date:'MMM d' }}</span>
                            </div>
                            <div *ngIf="!last" class="flex-1 h-0.5 mx-1" [ngClass]="step.state === 'done' ? 'bg-emerald-500' : 'bg-slate-200'"></div>
                          </ng-container>
                        </div>
                        <p *ngIf="order.estimatedDelivery" class="text-xs text-slate-500 mt-4">
                          Estimated delivery: <span class="font-bold text-slate-700">{{ order.estimatedDelivery | date:'EEEE, MMM d' }}</span>
                        </p>
                      </div>

                      <!-- Items -->
                      <div class="space-y-3 mb-6">
                        <div *ngFor="let item of order.items" class="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
                          <img [src]="item.product.images.length ? item.product.images[0].url : 'assets/images/placeholder.jpg'" [alt]="item.product.name" class="w-14 h-14 rounded-lg object-cover bg-slate-100" />
                          <div class="flex-1 min-w-0">
                            <p class="font-semibold text-slate-900 text-sm truncate">{{ item.product.name }}</p>
                            <p class="text-xs text-slate-500">Qty {{ item.quantity }} × \${{ item.price }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Shipping address + actions -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p class="text-xs text-slate-500 leading-relaxed">
                          Shipping to: <span class="font-semibold text-slate-700">{{ order.shippingFirstName }} {{ order.shippingLastName }}, {{ order.shippingStreet }}, {{ order.shippingCity }}, {{ order.shippingState }} {{ order.shippingZipCode }}</span>
                        </p>
                        <button *ngIf="order.isCancellable" (click)="cancelOrder(order)" [disabled]="cancellingOrderId === order.id"
                                class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors disabled:opacity-60 shrink-0">
                          {{ cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tab 3: Wishlist -->
            <section *ngIf="activeTab === 'wishlist'" class="bg-white rounded-3xl shadow-xl border border-slate-200/70 overflow-hidden">
              <header class="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
                <h2 class="text-xl font-extrabold text-slate-900">Saved Wishlist</h2>
                <p class="text-sm text-slate-500 mt-1">Products you've saved to buy later.</p>
              </header>
              <div class="p-6 sm:p-8">
                <div *ngIf="isLoadingWishlist" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div *ngFor="let _ of [1,2,3]" class="h-64 rounded-2xl bg-slate-100 animate-pulse"></div>
                </div>
                <div *ngIf="!isLoadingWishlist && wishlistItems.length === 0" class="text-center py-16">
                  <p class="text-slate-900 font-bold">Your wishlist is currently empty.</p>
                  <p class="text-slate-500 text-sm mt-1">Tap the heart icon on any product to save it here.</p>
                  <a routerLink="/" class="mt-5 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors">Explore Products</a>
                </div>

                <div *ngIf="wishlistItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div *ngFor="let item of wishlistItems" class="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div class="h-40 rounded-xl bg-slate-100 overflow-hidden mb-3">
                        <img [src]="item.product.images[0].url || 'assets/images/placeholder.svg'" [alt]="item.product.name" class="w-full h-full object-cover" />
                      </div>
                      <h4 class="font-bold text-slate-900 text-sm line-clamp-1">{{ item.product.name }}</h4>
                      <span class="text-sky-600 font-extrabold text-base mt-1 block">\${{ item.product.price }}</span>
                    </div>
                    <div class="flex gap-2 mt-4">
                      <button (click)="moveToCart(item)" class="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors">Move to Cart</button>
                      <button (click)="removeFromWishlist(item.id)" class="py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tab 4: Saved Addresses -->
            <section *ngIf="activeTab === 'addresses'" class="bg-white rounded-3xl shadow-xl border border-slate-200/70 overflow-hidden">
              <header class="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-xl font-extrabold text-slate-900">Saved Addresses</h2>
                  <p class="text-sm text-slate-500 mt-1">Manage where your orders get delivered.</p>
                </div>
                <button *ngIf="!showAddressForm" (click)="openAddressForm()" class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  Add New Address
                </button>
              </header>

              <div class="p-6 sm:p-8">
                <!-- Address form (add / edit) -->
                <form *ngIf="showAddressForm" [formGroup]="addressForm" (ngSubmit)="saveAddress()" class="mb-8 p-5 border border-sky-200 bg-sky-50/40 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
                    <input formControlName="firstName" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                    <input formControlName="lastName" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Street Address</label>
                    <input formControlName="street" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
                    <input formControlName="city" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">State</label>
                    <input formControlName="state" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">ZIP Code</label>
                    <input formControlName="zipCode" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Country</label>
                    <input formControlName="country" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone (optional)</label>
                    <input formControlName="phone" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
                  </div>
                  <p class="sm:col-span-2 text-xs text-slate-500 -mt-1">Orders to this address will be linked to <span class="font-semibold text-slate-700">{{ user?.email }}</span>, your account email.</p>
                  <label class="sm:col-span-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" formControlName="isDefault" class="w-4 h-4 rounded border-slate-300 text-sky-600" />
                    Set as default shipping address
                  </label>
                  <div class="sm:col-span-2 flex gap-3">
                    <button type="submit" [disabled]="addressForm.invalid || isSavingAddress" class="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm disabled:opacity-60 transition-colors">
                      {{ isSavingAddress ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Save Address') }}
                    </button>
                    <button type="button" (click)="closeAddressForm()" class="py-2.5 px-6 border border-slate-300 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                  </div>
                </form>

                <div *ngIf="isLoadingAddresses" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div *ngFor="let _ of [1,2]" class="h-32 rounded-2xl bg-slate-100 animate-pulse"></div>
                </div>
                <div *ngIf="!isLoadingAddresses && addresses.length === 0 && !showAddressForm" class="text-center py-16">
                  <p class="text-slate-900 font-bold">No saved addresses yet.</p>
                  <p class="text-slate-500 text-sm mt-1">Add an address to speed up checkout next time.</p>
                </div>

                <div *ngIf="addresses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div *ngFor="let addr of addresses" class="p-5 border-2 rounded-2xl relative transition-shadow hover:shadow-md" [ngClass]="addr.isDefault ? 'border-sky-300 bg-sky-50/30' : 'border-slate-200'">
                    <span *ngIf="addr.isDefault" class="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">Default Address</span>
                    <h4 class="font-bold text-slate-900 text-sm">{{ addr.firstName }} {{ addr.lastName }}</h4>
                    <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ addr.street }}, {{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}, {{ addr.country }}</p>
                    <span *ngIf="addr.phone" class="text-xs text-slate-500 block mt-2">{{ addr.phone }}</span>
                    <span *ngIf="addr.email" class="text-xs text-slate-500 block mt-0.5">{{ addr.email }}</span>
                    <div class="flex gap-2 mt-4">
                      <button (click)="editAddress(addr)" class="py-1.5 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">Edit</button>
                      <button *ngIf="!addr.isDefault" (click)="setDefaultAddress(addr)" class="py-1.5 px-3 border border-sky-300 text-sky-700 hover:bg-sky-50 text-xs font-bold rounded-lg transition-colors">Set Default</button>
                      <button (click)="deleteAddress(addr.id)" class="py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tab 5: Account Settings -->
            <section *ngIf="activeTab === 'settings'" class="bg-white rounded-3xl shadow-xl border border-slate-200/70 overflow-hidden">
              <header class="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
                <h2 class="text-xl font-extrabold text-slate-900">Change Password</h2>
                <p class="text-sm text-slate-500 mt-1">Use a strong password you don't use elsewhere.</p>
              </header>
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="p-6 sm:p-8 max-w-md space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Password</label>
                  <input formControlName="currentPassword" type="password" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-shadow" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">New Password</label>
                  <input formControlName="newPassword" type="password" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-shadow" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input formControlName="confirmNewPassword" type="password" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-shadow" />
                </div>
                <button type="submit" [disabled]="passwordForm.invalid || isChangingPassword" class="py-3 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all disabled:opacity-60">
                  {{ isChangingPassword ? 'Updating Password...' : 'Update Password' }}
                </button>
              </form>
            </section>

          </main>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  activeTab = 'profile';
  orders: Order[] = [];
  wishlistItems: WishlistItem[] = [];
  addresses: Address[] = [];
  isLoadingOrders = false;
  isLoadingWishlist = false;
  isLoadingAddresses = false;
  isSavingProfile = false;
  isChangingPassword = false;
  isSavingAddress = false;
  expandedOrderId: string | null = null;
  cancellingOrderId: string | null = null;
  showAddressForm = false;
  editingAddressId: string | null = null;

  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;

  tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'orders', label: 'My Orders' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'settings', label: 'Settings' },
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService,
    private addressService: AddressService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
    });

    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      phone: [''],
      isDefault: [false],
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab');
      if (tab && this.tabs.some((t) => t.id === tab)) {
        this.activeTab = tab;
      }
    });

    this.authService.currentUser$.subscribe((u) => {
      this.user = u;
      if (u) {
        this.profileForm.patchValue({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          phone: u.phone || '',
        });
      }
    });

    this.authService.getProfile().subscribe();

    this.loadOrders();
    this.loadWishlist();
    this.loadAddresses();
  }

  selectTab(tabId: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge',
    });
  }

  get userInitial(): string {
    if (this.user?.firstName) return this.user.firstName.charAt(0).toUpperCase();
    if (this.user?.email) return this.user.email.charAt(0).toUpperCase();
    return 'U';
  }

  get displayName(): string {
    if (this.user?.firstName) {
      return `${this.user.firstName} ${this.user.lastName || ''}`.trim();
    }
    return this.user?.email || 'User';
  }

  get memberSince(): string {
    if (!this.user?.createdAt) return '';
    return new Date(this.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  get completionPercentage(): number {
    let score = 40; // Base email + account
    if (this.user?.firstName) score += 30;
    if (this.user?.phone) score += 15;
    if (this.addresses.length > 0) score += 15;
    return score;
  }

  get activeOrderCount(): number {
    return this.orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING' || o.status === 'SHIPPED').length;
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-700';
      case 'SHIPPED':
        return 'bg-sky-100 text-sky-700';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-700';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  statusIconClass(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-600';
      case 'SHIPPED':
        return 'bg-sky-50 text-sky-600';
      case 'PROCESSING':
        return 'bg-amber-50 text-amber-600';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  }

  toggleOrder(orderId: string) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  loadOrders() {
    this.isLoadingOrders = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.data?.orders || [];
        this.isLoadingOrders = false;
      },
      error: () => {
        this.isLoadingOrders = false;
      },
    });
  }

  cancelOrder(order: Order) {
    this.cancellingOrderId = order.id;
    this.orderService.cancelOrder(order.id).subscribe({
      next: (res) => {
        this.orders = this.orders.map((o) => (o.id === order.id ? res.data : o));
        this.cancellingOrderId = null;
        this.toastService.success('Order Cancelled', `Order #${order.orderNumber} has been cancelled.`);
      },
      error: (err) => {
        this.cancellingOrderId = null;
        this.toastService.error('Unable to cancel order', err.error?.message || 'Please try again.');
      },
    });
  }

  loadWishlist() {
    this.isLoadingWishlist = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistItems = res.data?.items || [];
        this.isLoadingWishlist = false;
      },
      error: () => {
        this.isLoadingWishlist = false;
      },
    });
  }

  loadAddresses() {
    this.isLoadingAddresses = true;
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data || [];
        this.isLoadingAddresses = false;
      },
      error: () => {
        this.isLoadingAddresses = false;
      },
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    this.isSavingProfile = true;
    const { firstName, lastName, email, phone } = this.profileForm.value;
    this.authService.updateProfile({ firstName, lastName, email, phone }).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.toastService.success('Profile Updated', 'Your profile details have been saved successfully.');
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.toastService.error('Unable to update profile', err.error?.message || 'Please try again.');
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;
    if (newPassword !== confirmNewPassword) {
      this.toastService.error('Password Mismatch', 'New passwords do not match.');
      return;
    }

    this.isChangingPassword = true;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        this.toastService.success('Password Changed', 'Your password was updated successfully.');
      },
      error: (err) => {
        this.isChangingPassword = false;
        this.toastService.error('Error', err.error?.message || 'Failed to update password.');
      },
    });
  }

  moveToCart(item: WishlistItem) {
    this.cartService.addToCart(item.productId, 1).subscribe({
      next: () => {
        this.removeFromWishlist(item.id);
        this.toastService.success('Added to Cart', `${item.product.name} moved to cart.`);
      },
    });
  }

  removeFromWishlist(itemId: string) {
    this.wishlistService.removeFromWishlist(itemId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter((i) => i.id !== itemId);
        this.toastService.info('Removed', 'Item removed from wishlist.');
      },
    });
  }

  openAddressForm() {
    this.editingAddressId = null;
    this.addressForm.reset({ isDefault: this.addresses.length === 0 });
    this.showAddressForm = true;
  }

  editAddress(addr: Address) {
    this.editingAddressId = addr.id;
    this.addressForm.patchValue(addr);
    this.showAddressForm = true;
  }

  closeAddressForm() {
    this.showAddressForm = false;
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  saveAddress() {
    if (this.addressForm.invalid) return;
    this.isSavingAddress = true;
    const data = this.addressForm.value;

    const request = this.editingAddressId
      ? this.addressService.updateAddress(this.editingAddressId, data)
      : this.addressService.createAddress(data);

    request.subscribe({
      next: () => {
        this.isSavingAddress = false;
        this.toastService.success(this.editingAddressId ? 'Address Updated' : 'Address Added', 'Your address book has been updated.');
        this.closeAddressForm();
        this.loadAddresses();
      },
      error: (err) => {
        this.isSavingAddress = false;
        this.toastService.error('Unable to save address', err.error?.message || 'Please try again.');
      },
    });
  }

  setDefaultAddress(addr: Address) {
    this.addressService.updateAddress(addr.id, { isDefault: true }).subscribe({
      next: () => {
        this.toastService.success('Default Address Updated', `${addr.street} is now your default address.`);
        this.loadAddresses();
      },
    });
  }

  deleteAddress(id: string) {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter((a) => a.id !== id);
        this.toastService.info('Address Removed', 'The address has been deleted.');
      },
      error: (err) => {
        this.toastService.error('Unable to delete address', err.error?.message || 'Please try again.');
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.forceLogout();
        this.toastService.success('Logged Out Successfully', 'See you again!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.forceLogout();
        this.toastService.success('Logged Out Successfully', 'See you again!');
        this.router.navigate(['/login']);
      },
    });
  }
}
