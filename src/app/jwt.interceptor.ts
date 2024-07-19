import {HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {Observable} from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
  return next(req);
};
