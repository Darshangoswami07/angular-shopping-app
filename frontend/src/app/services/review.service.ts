import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FeaturedReview {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFeaturedReviews(limit: number = 6): Observable<{ status: string; data: FeaturedReview[] }> {
    return this.http.get<{ status: string; data: FeaturedReview[] }>(`${this.apiUrl}/reviews/featured`, {
      params: { limit },
    });
  }
}
