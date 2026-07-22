import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CONTACT_CONFIG } from '../../config/contact.config';

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
              <span class="text-2xl font-bold text-white">{{ contact.brandName }}</span>
            </div>
            <p class="text-slate-400 mb-6 leading-relaxed">
              {{ contact.brandTagline }}. Curated products and exceptional service, delivered with care.
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
                <span>{{ contact.address }}</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-sky-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 0111.19 18.9a19.5 19.5 0 01-6-6A19.79 19.79 0 012.07 4.23 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span>{{ contact.phone }}</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-sky-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a [href]="'mailto:' + contact.email" class="hover:text-sky-400">{{ contact.email }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-slate-400 text-sm">
            &copy; 2026 {{ contact.brandName }}. All rights reserved.
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
  readonly contact = CONTACT_CONFIG;
  socialLinks = [
    { url: CONTACT_CONFIG.github, label: "GitHub", viewBox: "0 0 24 24", paths: ["M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.54 1.04 1.54 1.04.9 1.54 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 1.03-2.71-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.03A9.57 9.57 0 0112 6.8c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.39.2 2.42.1 2.67.64.71 1.03 1.61 1.03 2.71 0 3.85-2.34 4.69-4.57 4.94.36.31.68.91.68 1.84v2.73c0 .27.18.58.69.48A10 10 0 0012 2z"] },
    { url: CONTACT_CONFIG.linkedin, label: "LinkedIn", viewBox: "0 0 24 24", paths: ["M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"] },
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
