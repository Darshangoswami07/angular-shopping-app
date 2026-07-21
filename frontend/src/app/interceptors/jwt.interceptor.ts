import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Always send credentials (cookies) for cross-origin requests
    let authReq = req.clone({ withCredentials: true });

    // Also attach Authorization header from stored session token as fallback
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.accessToken) {
          authReq = authReq.clone({
            setHeaders: { Authorization: `Bearer ${parsed.accessToken}` },
          });
        }
      } catch {
        // ignore parse errors
      }
    }

    return next.handle(authReq);
  }
}
