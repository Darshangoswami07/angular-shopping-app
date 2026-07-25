import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CartItem {
  id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
  };
  name?: string;
  price?: number;
  image?: string;
}

export interface CartResponse {
  status: string;
  data: {
    id: string;
    items: CartItem[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private cartOpenSubject = new BehaviorSubject<boolean>(false);
  public cartOpen$ = this.cartOpenSubject.asObservable();

  private isAuthenticated = false;
  private authSub: Subscription;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Always start with local storage
    this.loadFromLocalStorage();

    // React to auth state changes
    this.authSub = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.loadCart();
      } else {
        this.switchToLocal();
      }
    });
  }

  /**
   * Clean up subscription when service is destroyed (app teardown).
   */
  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  private loadCart() {
    if (!this.isAuthenticated) return;
    this.http.get<CartResponse>(`${this.apiUrl}/cart`).subscribe({
      next: (response) => {
        const items = response.data?.items ?? [];
        this.itemsSubject.next(items);
        this.recalculateCount(items);
      },
      error: () => {
        this.loadFromLocalStorage();
      },
    });
  }

  private loadFromLocalStorage() {
    const items = localStorage.getItem('cartItems');
    if (items) {
      this.itemsSubject.next(JSON.parse(items));
      this.recalculateCount(JSON.parse(items));
    }
  }

  /**
   * Called internally when user logs out.
   */
  private switchToLocal() {
    this.isAuthenticated = false;
    this.itemsSubject.next([]);
    this.cartCountSubject.next(0);
    localStorage.removeItem('cartItems');
  }

  /** @deprecated Use loadCart() internally instead */
  private getCartRaw(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/cart`);
  }

  addToCart(productId: string, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/cart/items`, { productId, quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  addToCartLegacy(product?: { id?: number; name?: string; price?: number; image?: string }) {
    if (!product?.name) return;
    const items = [...this.itemsSubject.value];
    const existingIndex = items.findIndex((i) => product?.id !== undefined && i.id === String(product.id));
    if (existingIndex !== -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({
        id: String(product.id || Date.now()),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        product: {
          id: String(product.id || Date.now()),
          name: product.name,
          price: product.price || 0,
          images: product.image ? [{ url: product.image }] : [],
        },
      });
    }
    this.itemsSubject.next(items);
    this.recalculateCount(items);
    this.cartOpenSubject.next(true);
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/cart/items/${itemId}`, { quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  updateQuantity(index: number, quantity: number) {
    const items = [...this.itemsSubject.value];
    if (index < 0 || index >= items.length) return;
    if (this.isAuthenticated && items[index].id) {
      this.updateCartItem(items[index].id, quantity).subscribe({ error: () => this.loadCart() });
      return;
    }
    items[index].quantity = Math.max(1, quantity);
    this.itemsSubject.next(items);
    this.recalculateCount(items);
  }

  removeCartItem(itemId: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/cart/items/${itemId}`).pipe(
      tap(() => this.loadCart())
    );
  }

  removeItem(index: number) {
    const item = this.itemsSubject.value[index];
    if (this.isAuthenticated && item?.id) {
      this.removeCartItem(item.id).subscribe({ error: () => this.loadCart() });
      return;
    }
    const next = this.itemsSubject.value.filter((_, i) => i !== index);
    this.itemsSubject.next(next);
    this.recalculateCount(next);
  }

  clearCart(): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/cart`).pipe(
      tap(() => {
        this.itemsSubject.next([]);
        this.cartCountSubject.next(0);
        localStorage.removeItem('cartItems');
      })
    );
  }

  toggleCart() {
    this.cartOpenSubject.next(!this.cartOpenSubject.value);
  }

  openCart() {
    this.cartOpenSubject.next(true);
  }

  closeCart() {
    this.cartOpenSubject.next(false);
  }

  private recalculateCount(items: CartItem[]) {
    const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    this.cartCountSubject.next(count);
    localStorage.setItem('cartItems', JSON.stringify(items));
  }

  getCartCount(): number {
    return this.cartCountSubject.value;
  }

  getItems(): CartItem[] {
    return [...this.itemsSubject.value];
  }
}
