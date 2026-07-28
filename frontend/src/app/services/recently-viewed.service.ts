import { Injectable } from '@angular/core';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 12;

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {
  record(productId: string) {
    const ids = this.getIds().filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
  }

  getIds(excludeId?: string): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      return excludeId ? ids.filter((id) => id !== excludeId) : ids;
    } catch {
      return [];
    }
  }
}
