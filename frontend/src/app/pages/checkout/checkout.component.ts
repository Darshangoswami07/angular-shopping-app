import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <main class="min-h-screen bg-slate-50 pt-28 pb-16 px-4">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8"><p class="text-sm font-bold uppercase tracking-widest text-sky-600">Secure checkout</p><h1 class="mt-2 text-4xl font-black text-slate-900">Complete your order</h1></div>
        <div *ngIf="items.length === 0" class="rounded-3xl bg-white p-12 text-center shadow-sm"><p class="text-lg font-semibold text-slate-700">Your cart is waiting for something special.</p><a routerLink="/" class="mt-5 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Continue shopping</a></div>
        <form *ngIf="items.length" [formGroup]="form" (ngSubmit)="placeOrder()" class="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section class="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
            <h2 class="text-xl font-black text-slate-900">Delivery address</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <label class="field">First name<input formControlName="firstName" autocomplete="given-name" /></label>
              <label class="field">Last name<input formControlName="lastName" autocomplete="family-name" /></label>
              <label class="field sm:col-span-2">Street address<input formControlName="street" autocomplete="street-address" /></label>
              <label class="field">City<input formControlName="city" autocomplete="address-level2" /></label>
              <label class="field">State / region<input formControlName="state" autocomplete="address-level1" /></label>
              <label class="field">Postal code<input formControlName="zipCode" autocomplete="postal-code" /></label>
              <label class="field">Country<input formControlName="country" autocomplete="country-name" /></label>
              <label class="field sm:col-span-2">Phone (optional)<input formControlName="phone" autocomplete="tel" /></label>
            </div>
            <div class="mt-8 rounded-2xl bg-sky-50 p-4 text-sm text-sky-950"><strong>Payment method: Cash on Delivery.</strong> Pay safely when your order arrives.</div>
          </section>
          <aside class="h-fit rounded-3xl bg-slate-900 p-6 text-white shadow-xl"><h2 class="text-xl font-black">Order summary</h2><div class="mt-5 space-y-4 border-b border-white/15 pb-5"><div *ngFor="let item of items" class="flex gap-3 text-sm"><img [src]="image(item)" [alt]="name(item)" class="h-12 w-12 rounded-lg object-cover"/><div class="flex-1"><p class="font-semibold">{{ name(item) }}</p><p class="text-slate-400">Qty {{ item.quantity }}</p></div><span class="font-bold">{{ price(item) * item.quantity | currency }}</span></div></div><div class="space-y-3 py-5 text-sm"><div class="flex justify-between text-slate-300"><span>Subtotal</span><span>{{ total | currency }}</span></div><div class="flex justify-between text-slate-300"><span>Delivery</span><span>{{ shipping | currency }}</span></div><div class="flex justify-between border-t border-white/15 pt-4 text-lg font-black"><span>Total</span><span>{{ total + shipping | currency }}</span></div></div><button [disabled]="form.invalid || submitting" class="w-full rounded-xl bg-sky-500 px-5 py-3 font-bold transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{{ submitting ? 'Placing order…' : 'Place secure order' }}</button></aside>
        </form>
      </div>
    </main>
  `,
  styles: [`.field{display:grid;gap:.5rem;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#475569}.field input{border:1px solid #cbd5e1;border-radius:.75rem;padding:.75rem 1rem;font-size:.95rem;font-weight:400;text-transform:none;letter-spacing:0;color:#0f172a;outline:none}.field input:focus{border-color:#0ea5e9;box-shadow:0 0 0 3px rgb(14 165 233/.15)}`],
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  shipping = 0;
  submitting = false;
  form = this.fb.group({ firstName: ['', Validators.required], lastName: ['', Validators.required], street: ['', Validators.required], city: ['', Validators.required], state: ['', Validators.required], zipCode: ['', Validators.required], country: ['United States', Validators.required], phone: [''] });
  constructor(private fb: FormBuilder, private cart: CartService, private orders: OrderService, private toast: ToastService, private router: Router) {}
  ngOnInit() { this.cart.items$.subscribe(items => { this.items = items; this.total = items.reduce((sum, item) => sum + this.price(item) * item.quantity, 0); this.shipping = this.total >= 99 ? 0 : 9.99; }); }
  name(item: CartItem) { return item.name ?? item.product?.name ?? 'Product'; }
  image(item: CartItem) { return item.image ?? item.product?.images?.[0]?.url ?? 'assets/images/placeholder.jpg'; }
  price(item: CartItem) { return item.price ?? item.product?.price ?? 0; }
  placeOrder() { if (this.form.invalid || !this.items.length) return; const items = this.items.filter(i => !!i.product?.id).map(i => ({ productId: i.product!.id, quantity: i.quantity })); if (items.length !== this.items.length) { this.toast.warning('Checkout unavailable', 'Please refresh your cart before placing this order.'); return; } this.submitting = true; this.orders.createOrder({ items, shippingAddress: this.form.getRawValue() as { firstName: string; lastName: string; street: string; city: string; state: string; zipCode: string; country: string; phone?: string } }).subscribe({ next: () => { this.cart.clearCart().subscribe(); this.toast.success('Order placed successfully', 'Thank you — we’ll email your order confirmation shortly.'); this.router.navigate(['/profile']); }, error: err => { this.submitting = false; this.toast.error('Unable to place order', err.error?.message ?? 'Please try again shortly.'); } }); }
}
