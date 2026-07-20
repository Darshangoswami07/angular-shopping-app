import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ status: string; data: Category[] }> {
    return this.http.get<{ status: string; data: Category[] }>(`${this.apiUrl}/categories`);
  }

  getCategoryById(id: string): Observable<{ status: string; data: Category }> {
    return this.http.get<{ status: string; data: Category }>(`${this.apiUrl}/categories/${id}`);
  }

  getCategoryBySlug(slug: string): Observable<{ status: string; data: Category }> {
    return this.http.get<{ status: string; data: Category }>(`${this.apiUrl}/categories/slug/${slug}`);
  }
}