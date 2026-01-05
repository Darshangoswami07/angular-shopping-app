import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0)
  public cartCount$ = this.cartCountSubject.asObservable()

  addToCart() {
    const currentCount = this.cartCountSubject.value
    this.cartCountSubject.next(currentCount + 1)
  }

  getCartCount(): number {
    return this.cartCountSubject.value
  }
}
