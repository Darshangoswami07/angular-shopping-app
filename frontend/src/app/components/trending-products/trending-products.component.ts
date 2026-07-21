import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { CartService } from "../../services/cart.service"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: string
}

@Component({
  selector: "app-trending-products",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="shop" class="py-20 px-4 bg-slate-50">
      <div class="container mx-auto">
        <div class="text-center mb-16 scroll-reveal">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Trending Products</h2>
          <p class="text-xl text-slate-600">Our most popular items this month</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let product of products; let i = index" 
               class="scroll-reveal group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
               [style.transition-delay.s]="i * 0.05">
            <!-- Product Image -->
            <div class="relative overflow-hidden bg-slate-100 aspect-square">
              <img [src]="product.image" 
                   [alt]="product.name" 
                   loading="lazy"
                   (error)="onImgError($event)"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div *ngIf="product.badge" 
                   class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {{ product.badge }}
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
              <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                {{ product.name }}
              </h3>
              
              <!-- Rating -->
              <div class="flex items-center gap-2 mb-3">
                <div class="flex">
                  <svg *ngFor="let star of [1,2,3,4,5]" 
                       class="w-4 h-4"
                       [class.text-amber-400]="star <= product.rating"
                       [class.text-slate-300]="star > product.rating"
                       [style.fill]="star <= product.rating ? 'currentColor' : 'none'"
                       fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </div>
                <span class="text-sm text-slate-600">({{ product.reviews }})</span>
              </div>

              <!-- Price -->
              <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl font-bold text-slate-900">\${{ product.price }}</span>
                <span *ngIf="product.originalPrice" 
                      class="text-sm text-slate-400 line-through">\${{ product.originalPrice }}</span>
              </div>

              <!-- Add to Cart Button -->
              <button (click)="addToCart(product)" 
                      class="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TrendingProductsComponent {
  constructor(private cartService: CartService) {}

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement
    if (img) {
      img.src = 'assets/images/placeholder.jpg'
      img.classList.add('opacity-70')
    }
  }

  products: Product[] = [
    {
      id: 1, name: "Premium Wireless Headphones", price: 299, originalPrice: 399, rating: 5, reviews: 243,
      image: "assets/images/premium-wireless-headphones.png", badge: "SALE",
    },
    {
      id: 2, name: "Luxury Minimalist Watch", price: 599, rating: 5, reviews: 189,
      image: "assets/images/luxury-minimalist-watch.jpg", badge: "NEW",
    },
    {
      id: 3, name: "Designer Leather Backpack", price: 199, originalPrice: 279, rating: 4, reviews: 156,
      image: "assets/images/designer-backpack.png",
    },
    {
      id: 4, name: "Smart Fitness Tracker", price: 149, rating: 5, reviews: 312,
      image: "assets/images/smart-fitness-tracker.png", badge: "HOT",
    },
    {
      id: 5, name: "Premium Leather Wallet", price: 89, rating: 5, reviews: 428,
      image: "assets/images/premium-leather-wallet.png",
    },
    {
      id: 6, name: "Designer Sunglasses", price: 249, originalPrice: 349, rating: 4, reviews: 198,
      image: "assets/images/designer-sunglasses.png", badge: "SALE",
    },
    {
      id: 7, name: "Portable Bluetooth Speaker", price: 129, rating: 5, reviews: 276,
      image: "assets/images/bluetooth-speaker.jpg",
    },
    {
      id: 8, name: "Premium Laptop Sleeve", price: 79, rating: 4, reviews: 164,
      image: "assets/images/laptop-sleeve.png",
    },
  ]

  addToCart(product: Product) {
    this.cartService.addToCartLegacy({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }
}
