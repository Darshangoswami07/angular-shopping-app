import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockAlert: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    position: number;
  }>;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    comment?: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
    };
  }>;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: string): Observable<{ status: string; data: Product }> {
    return this.http.get<{ status: string; data: Product }>(`${this.apiUrl}/products/${id}`);
  }

  getProductBySlug(slug: string): Observable<{ status: string; data: Product }> {
    return this.http.get<{ status: string; data: Product }>(`${this.apiUrl}/products/slug/${slug}`);
  }

  getFeaturedProducts(limit: number = 8): Observable<{ status: string; data: Product[] }> {
    return this.http.get<{ status: string; data: Product[] }>(`${this.apiUrl}/products/featured`, {
      params: { limit },
    });
  }
}