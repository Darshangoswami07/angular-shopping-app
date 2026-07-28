import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
  };
}

export interface Wishlist {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: WishlistItem[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = environment.apiUrl;

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  private authSub: Subscription;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authSub = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.refreshCount();
      } else {
        this.wishlistCountSubject.next(0);
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  private refreshCount() {
    this.getWishlist().subscribe({
      next: (res) => this.wishlistCountSubject.next(res.data?.items?.length ?? 0),
      error: () => this.wishlistCountSubject.next(0),
    });
  }

  getWishlist(): Observable<{ status: string; data: Wishlist }> {
    return this.http.get<{ status: string; data: Wishlist }>(`${this.apiUrl}/wishlist`);
  }

  addToWishlist(productId: string): Observable<{ status: string; message: string; data: WishlistItem }> {
    return this.http
      .post<{ status: string; message: string; data: WishlistItem }>(`${this.apiUrl}/wishlist/items`, { productId })
      .pipe(tap(() => this.refreshCount()));
  }

  removeFromWishlist(itemId: string): Observable<{ status: string; message: string }> {
    return this.http
      .delete<{ status: string; message: string }>(`${this.apiUrl}/wishlist/items/${itemId}`)
      .pipe(tap(() => this.refreshCount()));
  }

  clearWishlist(): Observable<{ status: string; message: string }> {
    return this.http
      .delete<{ status: string; message: string }>(`${this.apiUrl}/wishlist`)
      .pipe(tap(() => this.wishlistCountSubject.next(0)));
  }
}
