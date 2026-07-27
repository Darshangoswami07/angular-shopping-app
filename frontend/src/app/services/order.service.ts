import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
  };
}

export interface TrackingStep {
  key: string;
  label: string;
  state: 'done' | 'current' | 'upcoming' | 'skipped';
  date: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  shippingPhone?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  trackingSteps: TrackingStep[];
  estimatedDelivery: string | null;
  isCancellable: boolean;
}

export interface OrdersResponse {
  orders: Order[];
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
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone?: string;
    };
    notes?: string;
  }): Observable<{ status: string; message: string; data: Order }> {
    return this.http.post<{ status: string; message: string; data: Order }>(`${this.apiUrl}/orders`, data);
  }

  getOrders(page: number = 1, limit: number = 10): Observable<{ status: string; data: OrdersResponse }> {
    return this.http.get<{ status: string; data: OrdersResponse }>(`${this.apiUrl}/orders`, {
      params: { page, limit },
    });
  }

  getOrderById(orderId: string): Observable<{ status: string; data: Order }> {
    return this.http.get<{ status: string; data: Order }>(`${this.apiUrl}/orders/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<{ status: string; message: string; data: Order }> {
    return this.http.patch<{ status: string; message: string; data: Order }>(`${this.apiUrl}/orders/${orderId}/cancel`, {});
  }
}