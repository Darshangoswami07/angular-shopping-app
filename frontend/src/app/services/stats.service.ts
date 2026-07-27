import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StatsOverview {
  productCount: number;
  categoryCount: number;
  brandCount: number;
  orderCount: number;
  customerCount: number;
  averageRating: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOverview(): Observable<{ status: string; data: StatsOverview }> {
    return this.http.get<{ status: string; data: StatsOverview }>(`${this.apiUrl}/stats/overview`);
  }
}
