import { Component, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LucideAngularModule, Trash2 } from "lucide-angular"
import { Subscription } from "rxjs"
import { CartService, type CartItem } from "../../services/cart.service"

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section *ngIf="cartOpen" id="cart" class="py-12 px-4 bg-white">
      <div class="container mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-slate-900">Your Cart ({{ cartCount }})</h2>
          <div>
            <button *ngIf="cartCount > 0" (click)="clearCart()" class="px-4 py-2 bg-red-500 text-white rounded-md">Clear Cart</button>
          </div>
        </div>

        <div *ngIf="items.length === 0" class="text-slate-600">Your cart is empty. Add some great products!</div>

        <div *ngIf="items.length > 0" class="grid gap-4">
          <div *ngFor="let item of items; let i = index" class="p-4 rounded-lg bg-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img [src]="item.image || 'assets/images/placeholder.jpg'" alt="{{ item.name }}" class="w-16 h-16 object-cover rounded" />
              <div>
                <div class="font-medium text-slate-900">{{ item.name }}</div>
                <div class="text-sm text-slate-600">\${{ item.price ?? '--' }}</div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 border rounded px-2">
                <button (click)="decreaseQuantity(i)" class="px-2">-</button>
                <div class="px-2">{{ item.quantity }}</div>
                <button (click)="increaseQuantity(i)" class="px-2">+</button>
              </div>

              <button (click)="removeItem(i)" class="flex items-center gap-2 px-3 py-2 bg-white border rounded-md hover:bg-red-50">
                <lucide-icon [img]="Trash2" [size]="16"></lucide-icon>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CartComponent implements OnInit, OnDestroy {
  readonly Trash2 = Trash2

  items: CartItem[] = []
  cartCount = 0
  cartOpen = false

  private sub = new Subscription()

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.sub.add(this.cartService.items$.subscribe((items) => (this.items = items)))
    this.sub.add(this.cartService.cartCount$.subscribe((count) => (this.cartCount = count)))
    this.sub.add(this.cartService.cartOpen$.subscribe((open) => (this.cartOpen = open)))
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  increaseQuantity(index: number) {
    const item = this.items[index]
    if (!item) return
    this.cartService.updateQuantity(index, item.quantity + 1)
  }

  decreaseQuantity(index: number) {
    const item = this.items[index]
    if (!item) return
    if (item.quantity > 1) {
      this.cartService.updateQuantity(index, item.quantity - 1)
    } else {
      this.removeItem(index)
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index)
  }

  clearCart() {
    this.cartService.clearCart()
  }
}
