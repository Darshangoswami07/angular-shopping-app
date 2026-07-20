import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<{ status: string; data: Wishlist }> {
    return this.http.get<{ status: string; data: Wishlist }>(`${this.apiUrl}/wishlist`);
  }

  addToWishlist(productId: string): Observable<{ status: string; message: string; data: WishlistItem }> {
    return this.http.post<{ status: string; message: string; data: WishlistItem }>(`${this.apiUrl}/wishlist/items`, { productId });
  }

  removeFromWishlist(itemId: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/wishlist/items/${itemId}`);
  }

  clearWishlist(): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/wishlist`);
  }
}