import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-newsletter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div class="container mx-auto">
        <div class="max-w-2xl mx-auto text-center scroll-reveal">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-sky-500/20 backdrop-blur-sm rounded-2xl mb-6">
            <svg class="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          
          <h2 class="text-4xl md:text-5xl font-bold mb-4">Stay Updated</h2>
          <p class="text-xl text-slate-300 mb-8">
            Subscribe to our newsletter and get exclusive deals, new arrivals, and style tips delivered to your inbox.
          </p>

          <form (ngSubmit)="onSubmit()" class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div class="flex-1">
              <input 
                type="email" 
                [(ngModel)]="email"
                name="email"
                placeholder="Enter your email"
                required
                class="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
            <button 
              type="submit"
              class="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
              Subscribe
            </button>
          </form>

          <p *ngIf="submitted" class="mt-6 text-green-400 animate-fade-in">
            ✓ Thank you for subscribing! Check your inbox for exclusive offers.
          </p>

          <p class="text-sm text-slate-400 mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class NewsletterComponent {
  email = ""
  submitted = false

  onSubmit() {
    if (this.email) {
      this.submitted = true
      this.email = ""
      setTimeout(() => {
        this.submitted = false
      }, 5000)
    }
  }
}
