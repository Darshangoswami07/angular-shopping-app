import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  /** Always the account's own login email, set server-side — not user-editable. */
  email?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<{ status: string; data: Address[] }> {
    return this.http.get<{ status: string; data: Address[] }>(`${this.apiUrl}/addresses`);
  }

  createAddress(data: AddressInput): Observable<{ status: string; message: string; data: Address }> {
    return this.http.post<{ status: string; message: string; data: Address }>(`${this.apiUrl}/addresses`, data);
  }

  updateAddress(id: string, data: Partial<AddressInput>): Observable<{ status: string; message: string; data: Address }> {
    return this.http.put<{ status: string; message: string; data: Address }>(`${this.apiUrl}/addresses/${id}`, data);
  }

  deleteAddress(id: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/addresses/${id}`);
  }
}
