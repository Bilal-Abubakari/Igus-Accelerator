import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'apps/iaimc-frontend/environments/environment';
import {
  LocalStorageKeys,
  LocalStorageService,
} from 'libs/shared/services/local-storage.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

const refreshState = {
  isRefreshing: false,
  refreshTokenSubject: new BehaviorSubject<string | null>(null),
};

export const httpReqInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const http = inject(HttpClient);
  const localStorageService = inject(LocalStorageService);
  const baseUrl = environment.apiUrl;

  const isWhitelisted = (url: string): boolean => {
    const whiteListedRoutes = ['/auth/refresh', '/auth/anonymous'];
    const path = url.replace(baseUrl, '');
    return whiteListedRoutes.some((route) => path === route);
  };

  const addTokenToRequest = (
    req: HttpRequest<unknown>,
    token: string,
  ): HttpRequest<unknown> => {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getAnonymousToken = (): Observable<string> => {
    return http.get<{ accessToken: string }>(`${baseUrl}/auth/anonymous`).pipe(
      switchMap((response) => {
        const token = response.accessToken;
        if (token) {
          localStorageService.setLocalItem(
            LocalStorageKeys.ACCESS_TOKEN,
            token,
          );
          localStorageService.setLocalItem(
            LocalStorageKeys.IS_AUTHENTICATED,
            'true',
          );
          return of(token);
        }
        return throwError(() => new Error('Failed to authenticate user'));
      }),
      catchError((error) => {
        console.error('Error getting auth token:', error);
        return throwError(() => error);
      }),
    );
  };

  const handle401Error = (
    req: HttpRequest<unknown>,
  ): Observable<HttpEvent<unknown>> => {
    if (!refreshState.isRefreshing) {
      refreshState.isRefreshing = true;
      refreshState.refreshTokenSubject.next(null);

      return http
        .get<{
          accessToken: string;
        }>(`${baseUrl}/auth/refresh`, { withCredentials: true })
        .pipe(
          switchMap((response) => {
            refreshState.isRefreshing = false;
            const newToken = response.accessToken;

            if (newToken) {
              localStorageService.setLocalItem(
                LocalStorageKeys.ACCESS_TOKEN,
                newToken,
              );
              refreshState.refreshTokenSubject.next(newToken);

              // Retry the original request with the new token
              return next(addTokenToRequest(req, newToken));
            }

            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((error) => {
            refreshState.isRefreshing = false;
            localStorageService.removeItem(LocalStorageKeys.ACCESS_TOKEN);
            localStorageService.setLocalItem(
              LocalStorageKeys.IS_AUTHENTICATED,
              'false',
            );

            return throwError(() => error);
          }),
          finalize(() => {
            refreshState.isRefreshing = false;
          }),
        );
    } else {
      // If refresh is already happening, wait for the new token
      return refreshState.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          if (token) {
            return next(addTokenToRequest(req, token));
          }
          return throwError(() => new Error('No token available'));
        }),
      );
    }
  };

  if (isWhitelisted(request.url)) {
    return next(request);
  }

  const isAuthenticated = localStorageService.getLocalItem<boolean>(
    LocalStorageKeys.IS_AUTHENTICATED,
  );
  const token = localStorageService.getLocalItem<string>(
    LocalStorageKeys.ACCESS_TOKEN,
  );

  if (!isAuthenticated || !token) {
    return getAnonymousToken().pipe(
      switchMap((newToken) => {
        return next(addTokenToRequest(request, newToken));
      }),
      catchError((error) => {
        console.error('Error in anonymous token flow:', error);
        return next(request); // Try to proceed anyway as a fallback
      }),
    );
  }

  // Proceed with authentication
  const authReq = addTokenToRequest(request, token);

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(request);
      }
      return throwError(() => error);
    }),
  );
};
