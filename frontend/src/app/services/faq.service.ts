import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<{ status: string; data: Faq[] }> {
    return this.http.get<{ status: string; data: Faq[] }>(`${this.apiUrl}/faqs`);
  }
}
