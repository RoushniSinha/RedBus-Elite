import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * AuthInterceptor
 *
 * Automatically attaches the JWT Bearer token (stored in localStorage under
 * the key "redbus-token") to every outgoing HTTP request.
 *
 * If no token is present the request is forwarded unchanged.
 *
 * Usage: provide via HTTP_INTERCEPTORS in AppModule.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly TOKEN_KEY = 'redbus-token';

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
