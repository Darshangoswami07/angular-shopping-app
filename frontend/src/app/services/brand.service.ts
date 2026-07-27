import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBrands(): Observable<{ status: string; data: Brand[] }> {
    return this.http.get<{ status: string; data: Brand[] }>(`${this.apiUrl}/brands`);
  }
}
