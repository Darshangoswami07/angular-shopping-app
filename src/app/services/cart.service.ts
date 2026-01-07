import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface CartItem {
  id?: number
  name: string
  price?: number
  image?: string
  quantity: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0)
  public cartCount$ = this.cartCountSubject.asObservable()

  private itemsSubject = new BehaviorSubject<CartItem[]>([])
  public items$ = this.itemsSubject.asObservable()

  private cartOpenSubject = new BehaviorSubject<boolean>(false)
  public cartOpen$ = this.cartOpenSubject.asObservable()

  addToCart(product?: { id?: number; name?: string; price?: number; image?: string }) {
    if (!product?.name) return
    const items = [...this.itemsSubject.value]
    const existingIndex = items.findIndex((i) => product?.id !== undefined && i.id === product.id)
    if (existingIndex !== -1) {
      items[existingIndex].quantity += 1
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    }
    this.itemsSubject.next(items)
    this.recalculateCount(items)
    // Open cart sidebar when an item is added
    this.cartOpenSubject.next(true)
  }

  updateQuantity(index: number, quantity: number) {
    const items = [...this.itemsSubject.value]
    if (index < 0 || index >= items.length) return
    items[index].quantity = Math.max(1, quantity)
    this.itemsSubject.next(items)
    this.recalculateCount(items)
  }

  removeItem(index: number) {
    const next = this.itemsSubject.value.filter((_, i) => i !== index)
    this.itemsSubject.next(next)
    this.recalculateCount(next)
  }

  clearCart() {
    this.itemsSubject.next([])
    this.cartCountSubject.next(0)
  }

  toggleCart() {
    this.cartOpenSubject.next(!this.cartOpenSubject.value)
  }

  openCart() {
    this.cartOpenSubject.next(true)
  }

  closeCart() {
    this.cartOpenSubject.next(false)
  }

  private recalculateCount(items: CartItem[]) {
    const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0)
    this.cartCountSubject.next(count)
  }

  getCartCount(): number {
    return this.cartCountSubject.value
  }

  getItems(): CartItem[] {
    return [...this.itemsSubject.value]
  }
}
