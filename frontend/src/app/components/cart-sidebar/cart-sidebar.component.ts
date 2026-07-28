import { Component, type OnInit } from "@angular/core"
import { CommonModule, CurrencyPipe } from "@angular/common"
import { CartService, type CartItem } from "../../services/cart.service"
import { RouterModule } from '@angular/router';

@Component({
  selector: "app-cart-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div *ngIf="cartOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/40" (click)="close()"></div>

      <aside class="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl p-4 overflow-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">Your Cart ({{ cartCount }})</h3>
          <button (click)="close()" aria-label="Close cart" class="p-2 rounded hover:bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div *ngIf="items.length === 0" class="text-slate-600">Your cart is empty.</div>

        <div *ngIf="items.length > 0" class="space-y-4">
          <div *ngFor="let item of items; let i = index" class="flex items-center gap-3">
            <img [src]="item.image || (item.product?.images?.[0]?.url) || 'assets/images/placeholder.jpg'" alt="{{item.name || item.product?.name}}" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
              <div class="font-medium">{{ item.name || item.product?.name }}</div>
              <div class="text-sm text-slate-500">{{ (item.price ?? item.product?.price ?? 0) | currency }}</div>
              <div class="mt-2 flex items-center gap-2">
                <button (click)="decrease(i)" class="px-2 py-1 border rounded">-</button>
                <div class="px-2">{{ item.quantity }}</div>
                <button (click)="increase(i)" class="px-2 py-1 border rounded">+</button>
              </div>
            </div>
            <div>
              <button (click)="remove(i)" class="text-red-500 hover:underline flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Remove
              </button>
            </div>
          </div>

          <div class="pt-4 border-t flex items-center justify-between">
            <div class="text-lg font-bold">Total</div>
            <div class="text-lg font-bold">\${{ total | number:'1.2-2' }}</div>
          </div>

          <div class="pt-4">
            <a routerLink="/checkout" (click)="close()" class="block w-full bg-sky-600 text-center text-white py-3 rounded">Checkout</a>
          </div>
        </div>
      </aside>
    </div>
  `,
})
export class CartSidebarComponent implements OnInit {
  items: CartItem[] = []
  cartOpen = false
  cartCount = 0
  total = 0

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.items$.subscribe((items) => {
      this.items = items
      this.total = items.reduce((s, i) => s + ((i.price || i.product?.price || 0) * (i.quantity || 0)), 0)
    })

    this.cartService.cartOpen$.subscribe((open) => (this.cartOpen = open))
    this.cartService.cartCount$.subscribe((count) => (this.cartCount = count))
  }

  increase(index: number) {
    const item = this.items[index]
    if (!item) return
    this.cartService.updateQuantity(index, item.quantity + 1)
  }

  decrease(index: number) {
    const item = this.items[index]
    if (!item) return
    if (item.quantity > 1) this.cartService.updateQuantity(index, item.quantity - 1)
    else this.remove(index)
  }

  remove(index: number) {
    this.cartService.removeItem(index)
  }

  close() {
    this.cartService.closeCart()
  }
}
