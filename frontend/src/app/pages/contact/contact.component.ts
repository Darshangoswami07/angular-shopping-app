import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { CONTACT_CONFIG } from '../../config/contact.config';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen">

  <!-- ============ HERO ============ -->
  <section class="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-2xl relative z-10 scroll-reveal">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4">We're here to help</h1>
      <p class="text-lg text-slate-300 leading-relaxed">
        Questions about an order, a return, or how something works — send it over and a real person reads it.
      </p>
    </div>
  </section>

  <!-- ============ CONTACT CARDS ============ -->
  <section class="py-16 px-4 bg-white -mt-10 relative z-10">
    <div class="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
      <div class="scroll-reveal bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center hover:-translate-y-1 hover:shadow-2xl transition-all">
        <div class="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Email Us</h3>
        <a [href]="'mailto:' + contact.email" class="text-sm text-sky-600 hover:text-sky-700 font-medium break-all">{{ contact.email }}</a>
      </div>
      <div class="scroll-reveal bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center hover:-translate-y-1 hover:shadow-2xl transition-all" style="transition-delay: 0.05s">
        <div class="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 0111.19 18.9a19.5 19.5 0 01-6-6A19.79 19.79 0 012.07 4.23 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        </div>
        <h3 class="font-bold text-slate-900 mb-1">Call Us</h3>
        <a [href]="'tel:' + contact.phone" class="text-sm text-sky-600 hover:text-sky-700 font-medium">{{ contact.phone }}</a>
      </div>
      <div class="scroll-reveal bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center hover:-translate-y-1 hover:shadow-2xl transition-all" style="transition-delay: 0.1s">
        <div class="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 class="font-bold text-slate-900 mb-1">{{ contact.supportHours }}</h3>
        <p class="text-sm text-slate-500">We reply within 24 hours</p>
      </div>
    </div>
  </section>

  <!-- ============ FORM + MAP + HOURS ============ -->
  <section class="py-16 px-4 bg-slate-50">
    <div class="container mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_1fr] gap-10">

      <!-- Form -->
      <div class="scroll-reveal bg-white rounded-3xl shadow-xl border border-slate-200/70 p-8 sm:p-10">
        <h2 class="text-2xl font-bold text-slate-900 mb-1">Send us a message</h2>
        <p class="text-sm text-slate-500 mb-8">Fill out the form and our team will get back to you shortly.</p>

        <form [formGroup]="contactForm" (ngSubmit)="submit()" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input formControlName="name" type="text" placeholder="Jane Doe"
                   class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-shadow"
                   [ngClass]="invalid('name') ? 'border-red-300 focus:ring-red-500/10' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'" />
            <p *ngIf="invalid('name')" class="text-xs text-red-600 mt-1.5">Please enter your name (at least 2 characters).</p>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input formControlName="email" type="email" placeholder="jane&#64;example.com"
                   class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-shadow"
                   [ngClass]="invalid('email') ? 'border-red-300 focus:ring-red-500/10' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'" />
            <p *ngIf="invalid('email')" class="text-xs text-red-600 mt-1.5">Please enter a valid email address.</p>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject</label>
            <input formControlName="subject" type="text" placeholder="Question about my order"
                   class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-shadow"
                   [ngClass]="invalid('subject') ? 'border-red-300 focus:ring-red-500/10' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'" />
            <p *ngIf="invalid('subject')" class="text-xs text-red-600 mt-1.5">Please enter a subject (at least 3 characters).</p>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Message</label>
            <textarea formControlName="message" rows="5" placeholder="Tell us how we can help…"
                      class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-shadow resize-none"
                      [ngClass]="invalid('message') ? 'border-red-300 focus:ring-red-500/10' : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/10'"></textarea>
            <div class="flex justify-between mt-1.5">
              <p *ngIf="invalid('message')" class="text-xs text-red-600">Message must be at least 10 characters.</p>
              <p class="text-xs text-slate-400 ml-auto">{{ contactForm.value.message?.length || 0 }}/2000</p>
            </div>
          </div>
          <div class="sm:col-span-2">
            <button type="submit" [disabled]="isSending" class="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60 flex items-center justify-center gap-2">
              <svg *ngIf="isSending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              {{ isSending ? 'Sending…' : 'Send Message' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Map placeholder + hours -->
      <div class="space-y-6">
        <div class="scroll-reveal rounded-3xl overflow-hidden border border-slate-200 shadow-xl h-56 relative bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center" style="transition-delay: 0.1s">
          <div class="absolute inset-0 opacity-40" style="background-image: radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0); background-size: 20px 20px;"></div>
          <div class="relative z-10 text-center px-6">
            <svg class="w-10 h-10 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <p class="font-bold text-slate-700 text-sm">{{ contact.address }}</p>
            <p class="text-xs text-slate-500 mt-1">Map preview unavailable in this demo build</p>
          </div>
        </div>

        <div class="scroll-reveal bg-white rounded-3xl border border-slate-200 shadow-xl p-6" style="transition-delay: 0.15s">
          <h3 class="font-bold text-slate-900 mb-4">Business Hours</h3>
          <ul class="space-y-2.5 text-sm">
            <li *ngFor="let row of hours" class="flex justify-between">
              <span class="text-slate-500">{{ row.day }}</span>
              <span class="font-semibold text-slate-800">{{ row.time }}</span>
            </li>
          </ul>
        </div>

        <div class="scroll-reveal bg-gradient-to-br from-sky-600 to-blue-700 rounded-3xl p-6 text-white" style="transition-delay: 0.2s">
          <h3 class="font-bold mb-2">Have a quick question?</h3>
          <p class="text-sm text-sky-100 mb-4">Check our FAQ — most answers are already there.</p>
          <a routerLink="/faq" class="inline-flex items-center gap-2 px-4 py-2 bg-white text-sky-700 font-bold rounded-xl text-sm no-underline hover:bg-sky-50 transition-colors">
            Visit FAQ
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>
  `,
})
export class ContactPageComponent {
  readonly contact = CONTACT_CONFIG;
  contactForm: FormGroup;
  isSending = false;

  readonly hours = [
    { day: 'Monday – Friday', time: '9:00 AM – 8:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 6:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 4:00 PM' },
    { day: 'Live Chat & Email', time: '24/7' },
  ];

  constructor(private fb: FormBuilder, private contactService: ContactService, private toastService: ToastService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  invalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isSending = true;
    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.isSending = false;
        this.toastService.success('Message Sent', res.message);
        this.contactForm.reset();
      },
      error: (err) => {
        this.isSending = false;
        this.toastService.error('Unable to send message', err.error?.message || 'Please try again shortly.');
      },
    });
  }
}
