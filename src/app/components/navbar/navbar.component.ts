import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { CartService } from "../../services/cart.service"
import { LucideAngularModule, ShoppingCart, Menu, X } from "lucide-angular"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 glassmorphism shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-xl">L</span>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">LuxeStore</span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-8">
            <a href="#shop" class="text-slate-700 hover:text-sky-600 font-medium transition-colors">Shop</a>
            <a href="#categories" class="text-slate-700 hover:text-sky-600 font-medium transition-colors">Categories</a>
            <a href="#about" class="text-slate-700 hover:text-sky-600 font-medium transition-colors">About</a>
            
            <!-- Cart Icon with Badge -->
            <button class="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <lucide-icon [img]="ShoppingCart" class="text-slate-700" [size]="24"></lucide-icon>
              <span *ngIf="cartCount > 0" 
                    class="absolute -top-1 -right-1 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {{ cartCount }}
              </span>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button (click)="toggleMobileMenu()" class="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <lucide-icon [img]="mobileMenuOpen ? X : Menu" [size]="24"></lucide-icon>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" class="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 animate-fade-in">
          <div class="flex flex-col gap-4">
            <a href="#shop" class="text-slate-700 hover:text-sky-600 font-medium transition-colors">Shop</a>
            <a href="#categories" class="text-slate-700 hover:text-sky-600 font-medium transition-colors">Categories</a>
            <a href="#about" class="text-slate-700 hover:text-sky-600 font-medium transition-colors">About</a>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="ShoppingCart" [size]="20"></lucide-icon>
              <span class="text-slate-700">Cart ({{ cartCount }})</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  readonly ShoppingCart = ShoppingCart
  readonly Menu = Menu
  readonly X = X

  cartCount = 0
  mobileMenuOpen = false

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count
    })
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }
}
