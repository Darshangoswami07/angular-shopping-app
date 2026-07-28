import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

export interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleAccountsId {
  initialize(config: GoogleIdConfiguration): void;
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
}

declare const google: { accounts: { id: GoogleAccountsId } } | undefined;

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/**
 * Single owner of Google Identity Services on the page. The <script> tag is
 * loaded exactly once from index.html; this service is the only code that
 * touches the `google.accounts.id` global, so initialize()/renderButton()
 * are never raced or duplicated across components.
 */
@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly ready: Promise<boolean>;

  constructor(private ngZone: NgZone) {
    this.ready = this.waitForScript();
  }

  private getAccountsId(): GoogleAccountsId | null {
    return typeof google !== 'undefined' && google?.accounts?.id ? google.accounts.id : null;
  }

  private waitForScript(): Promise<boolean> {
    if (this.getAccountsId()) {
      return Promise.resolve(true);
    }
    const script = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SCRIPT_SRC}"]`);
    if (!script) {
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      script.addEventListener('load', () => resolve(true), { once: true });
      script.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  /**
   * Renders a Google Sign-In button into `container` once the GSI script is
   * ready. Safe to call from multiple pages/components — each call
   * re-registers its own callback right before rendering, which GIS
   * supports natively (initialize() is idempotent).
   */
  async renderButton(
    container: HTMLElement,
    onCredential: (response: GoogleCredentialResponse) => void,
    options: Record<string, unknown> = {}
  ): Promise<void> {
    if (!environment.googleClientId) {
      console.error('[GoogleAuthService] NG_APP_GOOGLE_CLIENT_ID is not configured.');
      return;
    }

    const scriptLoaded = await this.ready;
    const accountsId = scriptLoaded ? this.getAccountsId() : null;
    if (!accountsId) {
      console.error('[GoogleAuthService] Google Identity Services script failed to load.');
      return;
    }

    accountsId.initialize({
      client_id: environment.googleClientId,
      callback: (response: GoogleCredentialResponse) => this.ngZone.run(() => onCredential(response)),
    });

    accountsId.renderButton(container, {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'continue_with',
      ...options,
    });
  }
}
