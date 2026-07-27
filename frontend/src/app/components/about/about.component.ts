import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CONTACT_CONFIG } from '../../config/contact.config';

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="py-20 px-4 bg-slate-50">
      <div class="container mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-slate-900 mb-2">About {{ contact.brandName }}</h2>
          <p class="text-lg text-slate-600">We bring together thousands of products across every category — from tech and fashion to home and grocery essentials — so you always find what you need in one place.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-6 shadow">
            <h4 class="font-bold mb-2">Quality</h4>
            <p class="text-slate-600">We source only the best materials and trusted brands.</p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow">
            <h4 class="font-bold mb-2">Customer-first</h4>
            <p class="text-slate-600">Customer satisfaction is our top priority — we guarantee a smooth shopping experience.</p>
          </div>
          <div class="bg-white rounded-lg p-6 shadow">
            <h4 class="font-bold mb-2">Sustainability</h4>
            <p class="text-slate-600">We aim to reduce our footprint by working with environmentally conscious partners.</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  readonly contact = CONTACT_CONFIG;
}
