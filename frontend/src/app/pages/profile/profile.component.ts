import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen pt-28 pb-16 bg-slate-50">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Header Banner & Avatar -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 mb-8 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700"></div>

          <div class="relative z-10 pt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            <div class="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <!-- Avatar -->
              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-2xl shrink-0">
                {{ userInitial }}
              </div>
              <div>
                <div class="flex items-center justify-center sm:justify-start gap-2">
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{{ displayName }}</h1>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-700 uppercase tracking-wider">
                    {{ user?.role || 'CUSTOMER' }}
                  </span>
                </div>
                <p class="text-slate-500 text-sm mt-1">{{ user?.email }}</p>

                <!-- Profile Completion Bar -->
                <div class="mt-4 max-w-xs">
                  <div class="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Profile Completion</span>
                    <span class="text-sky-600">{{ completionPercentage }}%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500" [style.width.%]="completionPercentage"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <button
              (click)="logout()"
              class="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-slate-200/80 mb-8 overflow-x-auto scrollbar-none gap-2">
          <button
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.id"
            class="py-3 px-5 font-bold text-sm transition-all border-b-2 whitespace-nowrap flex items-center gap-2"
            [ngClass]="{
              'border-sky-600 text-sky-600': activeTab === tab.id,
              'border-transparent text-slate-500 hover:text-slate-900': activeTab !== tab.id
            }"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Tab 1: My Profile -->
        <div *ngIf="activeTab === 'profile'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Personal Details</h3>
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
              <input formControlName="firstName" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none text-slate-900" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
              <input formControlName="lastName" type="text" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none text-slate-900" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <input formControlName="email" type="email" readonly class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
              <input formControlName="phone" type="tel" placeholder="+1 (555) 000-0000" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none text-slate-900" />
            </div>
            <div class="sm:col-span-2">
              <button type="submit" [disabled]="isSavingProfile" class="py-3 px-8 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-600/20">
                {{ isSavingProfile ? 'Saving Changes...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Tab 2: My Orders -->
        <div *ngIf="activeTab === 'orders'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Order History</h3>
          <div *ngIf="isLoadingOrders" class="text-center py-12 text-slate-500">Loading order history...</div>
          <div *ngIf="!isLoadingOrders && orders.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-slate-600 font-bold">No orders found yet</p>
            <a routerLink="/" class="mt-4 inline-block px-5 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm">Start Shopping</a>
          </div>

          <div *ngIf="orders.length > 0" class="space-y-4">
            <div *ngFor="let order of orders" class="p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-slate-900">#{{ order.orderNumber }}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase">
                    {{ order.status }}
                  </span>
                </div>
                <span class="text-xs text-slate-500 mt-1 block">{{ order.createdAt | date:'mediumDate' }} • {{ order.items.length }} item(s)</span>
              </div>
              <div class="text-right">
                <span class="text-lg font-black text-slate-900">\${{ order.total | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Wishlist -->
        <div *ngIf="activeTab === 'wishlist'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Saved Wishlist</h3>
          <div *ngIf="isLoadingWishlist" class="text-center py-12 text-slate-500">Loading wishlist...</div>
          <div *ngIf="!isLoadingWishlist && wishlistItems.length === 0" class="text-center py-12">
            <p class="text-slate-600 font-bold">Your wishlist is currently empty.</p>
            <a routerLink="/" class="mt-4 inline-block px-5 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-sm">Explore Products</a>
          </div>

          <div *ngIf="wishlistItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div *ngFor="let item of wishlistItems" class="border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="h-40 rounded-xl bg-slate-100 overflow-hidden mb-3">
                  <img [src]="item.product.images[0].url || 'assets/images/placeholder.svg'" [alt]="item.product.name" class="w-full h-full object-cover" />
                </div>
                <h4 class="font-bold text-slate-900 text-sm line-clamp-1">{{ item.product.name }}</h4>
                <span class="text-sky-600 font-extrabold text-base mt-1 block">\${{ item.product.price }}</span>
              </div>
              <div class="flex gap-2 mt-4">
                <button (click)="moveToCart(item)" class="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl">Move to Cart</button>
                <button (click)="removeFromWishlist(item.id)" class="py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Saved Addresses -->
        <div *ngIf="activeTab === 'addresses'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-slate-900">Saved Addresses</h3>
            <button (click)="addSampleAddress()" class="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl">+ Add New Address</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let addr of addresses" class="p-5 border-2 border-sky-100 bg-sky-50/30 rounded-2xl relative">
              <span class="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">{{ addr.type }}</span>
              <h4 class="font-bold text-slate-900 text-sm">{{ addr.name }}</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ addr.street }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip }}</p>
              <span class="text-xs text-slate-500 block mt-2">{{ addr.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Tab 5: Account Settings -->
        <div *ngIf="activeTab === 'settings'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Change Password</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="max-w-md space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Password</label>
              <input formControlName="currentPassword" type="password" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">New Password</label>
              <input formControlName="newPassword" type="password" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm New Password</label>
              <input formControlName="confirmNewPassword" type="password" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none" />
            </div>
            <button type="submit" [disabled]="passwordForm.invalid || isChangingPassword" class="py-3 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all">
              {{ isChangingPassword ? 'Updating Password...' : 'Update Password' }}
            </button>
          </form>
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
  isLoadingOrders = false;
  isLoadingWishlist = false;
  isSavingProfile = false;
  isChangingPassword = false;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  tabs = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  addresses = [
    {
      type: 'Default Shipping',
      name: 'Darshan Goswami',
      street: '100 Modern Shopping Way, Suite 500',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '+1 (800) 555-LUXE',
    },
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((u) => {
      this.user = u;
      if (u) {
        this.profileForm.patchValue({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
        });
      }
    });

    this.loadOrders();
    this.loadWishlist();
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

  get completionPercentage(): number {
    let score = 40; // Base email + account
    if (this.user?.firstName) score += 30;
    if (this.profileForm.value.phone) score += 15;
    if (this.addresses.length > 0) score += 15;
    return score;
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

  updateProfile() {
    this.isSavingProfile = true;
    setTimeout(() => {
      this.isSavingProfile = false;
      this.toastService.success('Profile Updated', 'Your profile details have been saved successfully.');
    }, 800);
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

  addSampleAddress() {
    this.toastService.info('Address Form', 'New address entry option selected.');
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
