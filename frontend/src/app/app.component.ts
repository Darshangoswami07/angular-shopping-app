import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';
import { UserExistsModalComponent } from './components/modal/user-exists-modal.component';
import { AuthPromptModalComponent } from './components/modal/auth-prompt-modal.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CartSidebarComponent, FooterComponent, ToastComponent, UserExistsModalComponent, AuthPromptModalComponent],
  template: `
    <app-toast></app-toast>
    <app-user-exists-modal></app-user-exists-modal>
    <app-auth-prompt-modal></app-auth-prompt-modal>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <app-navbar></app-navbar>
      <app-cart-sidebar></app-cart-sidebar>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    </div>
  `,
})
export class AppComponent {}
