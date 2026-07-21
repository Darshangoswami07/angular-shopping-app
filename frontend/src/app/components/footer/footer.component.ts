import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-slate-900 text-slate-300 py-16 px-4">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- Company Info -->
          <div class="scroll-reveal">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-xl">L</span>
              </div>
              <span class="text-2xl font-bold text-white">LuxeStore</span>
            </div>
            <p class="text-slate-400 mb-6 leading-relaxed">
              Your premier destination for quality products and exceptional service. Elevate your lifestyle with LuxeStore.
            </p>
            <div class="flex gap-4">
              <a *ngFor="let social of socialLinks" 
                 [href]="social.url"
                 [attr.aria-label]="social.label"
                 class="w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" [attr.viewBox]="social.viewBox">
                  <path *ngFor="let p of social.paths" [attr.d]="p" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="scroll-reveal" style="transition-delay: 0.1s">
            <h3 class="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-3">
              <li *ngFor="let link of quickLinks">
                <a [href]="link.url" class="hover:text-sky-400 transition-colors">{{ link.label }}</a>
              </li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div class="scroll-reveal" style="transition-delay: 0.2s">
            <h3 class="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul class="space-y-3">
              <li *ngFor="let link of customerLinks">
                <a [href]="link.url" class="hover:text-sky-400 transition-colors">{{ link.label }}</a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="scroll-reveal" style="transition-delay: 0.3s">
            <h3 class="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-sky-400 mt-1 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>123 Commerce Street<br />New York, NY 10013</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-sky-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 0111.19 18.9a19.5 19.5 0 01-6-6A19.79 19.79 0 012.07 4.23 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-sky-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>support&#64;luxestore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-slate-400 text-sm">
            &copy; 2025 LuxeStore. All rights reserved.
          </p>
          <div class="flex gap-6 text-sm">
            <a href="#privacy" class="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#terms" class="hover:text-sky-400 transition-colors">Terms of Service</a>
            <a href="#cookies" class="hover:text-sky-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  socialLinks = [
    { url: "#facebook", label: "Facebook", viewBox: "0 0 24 24", paths: ["M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"] },
    { url: "#twitter", label: "Twitter", viewBox: "0 0 24 24", paths: ["M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"] },
    { url: "#instagram", label: "Instagram", viewBox: "0 0 24 24", paths: ["M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 0a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7z M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01"] },
    { url: "#linkedin", label: "LinkedIn", viewBox: "0 0 24 24", paths: ["M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"] },
  ]

  quickLinks = [
    { label: "About Us", url: "#about" },
    { label: "Shop", url: "#shop" },
    { label: "Categories", url: "#categories" },
    { label: "Blog", url: "#blog" },
    { label: "Contact", url: "#contact" },
  ]

  customerLinks = [
    { label: "My Account", url: "#account" },
    { label: "Order Tracking", url: "#tracking" },
    { label: "Shipping Info", url: "#shipping" },
    { label: "Returns", url: "#returns" },
    { label: "FAQ", url: "#faq" },
  ]
}
