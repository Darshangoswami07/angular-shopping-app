import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  actionFn?: () => void;
}

export interface UserExistsModalState {
  isOpen: boolean;
  email?: string;
}

export type AuthPromptAction = 'cart' | 'wishlist' | 'general';

export interface AuthPromptModalState {
  isOpen: boolean;
  action?: AuthPromptAction;
  returnUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private userExistsModalSubject = new BehaviorSubject<UserExistsModalState>({ isOpen: false });
  public userExistsModal$ = this.userExistsModalSubject.asObservable();

  private authPromptModalSubject = new BehaviorSubject<AuthPromptModalState>({ isOpen: false });
  public authPromptModal$ = this.authPromptModalSubject.asObservable();

  show(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 4000,
      ...toast,
    };

    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }
  }

  success(title: string, message: string, duration = 4000) {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration = 5000) {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration = 4000) {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration = 4000) {
    this.show({ type: 'info', title, message, duration });
  }

  remove(id: string) {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter((t) => t.id !== id));
  }

  openUserExistsModal(email?: string) {
    this.userExistsModalSubject.next({ isOpen: true, email });
  }

  closeUserExistsModal() {
    this.userExistsModalSubject.next({ isOpen: false });
  }

  openAuthPrompt(action: AuthPromptAction = 'general', returnUrl?: string) {
    this.authPromptModalSubject.next({ isOpen: true, action, returnUrl });
  }

  closeAuthPrompt() {
    this.authPromptModalSubject.next({ isOpen: false });
  }
}
