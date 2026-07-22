import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, type CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="container mx-auto max-w-4xl">
        <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-900">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-slate-900">Shopping Cart ({{ cartCount }})</h1>
            <button
              *ngIf="cartCount > 0"
              (click)="clearCart()"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div *ngIf="items.length === 0" class="text-center py-16">
            <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <p class="text-slate-600 text-lg">Your cart is empty.</p>
            <a routerLink="/" class="inline-block mt-4 px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors no-underline">
              Continue Shopping
            </a>
          </div>

          <div *ngIf="items.length > 0" class="space-y-4">
            <div *ngFor="let item of items; let i = index" class="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl hover:border-sky-300 transition-colors">
              <img
                [src]="item.image || (item.product?.images?.[0]?.url) || 'assets/images/placeholder.jpg'"
                [alt]="item.name || item.product?.name"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="font-semibold text-slate-900">{{ item.name || item.product?.name }}</h3>
                <p class="text-slate-600 text-sm">\${{ (item.price ?? item.product?.price ?? 0) | number:'1.2-2' }}</p>
              </div>
              <div class="flex items-center gap-2 border-2 border-slate-300 rounded-lg px-2 py-1">
                <button (click)="decreaseQuantity(i)" class="px-2 py-1 hover:bg-slate-100 rounded transition-colors font-bold">-</button>
                <span class="px-2 font-semibold min-w-[2rem] text-center">{{ item.quantity }}</span>
                <button (click)="increaseQuantity(i)" class="px-2 py-1 hover:bg-slate-100 rounded transition-colors font-bold">+</button>
              </div>
              <div class="font-bold text-slate-900 min-w-[80px] text-right">
                \${{ ((item.price ?? item.product?.price ?? 0) * item.quantity) | number:'1.2-2' }}
              </div>
              <button (click)="removeItem(i)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>

            <div class="border-t-2 border-slate-200 pt-4 mt-4">
              <div class="flex items-center justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>\${{ total | number:'1.2-2' }}</span>
              </div>
              <a routerLink="/checkout" class="block w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-center text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20">
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CartPageComponent implements OnInit {
  items: CartItem[] = [];
  cartCount = 0;
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.total = items.reduce(
        (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * item.quantity,
        0
      );
    });
    this.cartService.cartCount$.subscribe((count) => (this.cartCount = count));
  }

  increaseQuantity(index: number) {
    const item = this.items[index];
    if (!item) return;
    this.cartService.updateQuantity(index, item.quantity + 1);
  }

  decreaseQuantity(index: number) {
    const item = this.items[index];
    if (!item) return;
    if (item.quantity > 1) {
      this.cartService.updateQuantity(index, item.quantity - 1);
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }
}
