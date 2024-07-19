import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private apiUrl: string = "http://localhost:8080/api/auth"

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(response => {
        sessionStorage.setItem('token', response.jwt);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user)); // Сохраняем информацию о пользователе
      }));
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }

  getCurrentUser(): any {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
